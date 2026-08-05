import { giscusConfig } from "../config";

export type GiscusCommentCounts = Record<string, number>;

type DiscussionsResponse = {
	data?: {
		repository?: {
			discussions: {
				nodes: Array<{
					title: string;
					comments: {
						totalCount: number;
						nodes: Array<{ replies: { totalCount: number } }>;
					};
				}>;
				pageInfo: {
					hasNextPage: boolean;
					endCursor: string | null;
				};
			};
		};
	};
	errors?: Array<{ message: string }>;
};

const discussionsQuery = `
	query ArchiveCommentCounts($owner: String!, $name: String!, $after: String) {
		repository(owner: $owner, name: $name) {
			discussions(first: 100, after: $after) {
				nodes {
					title
					comments(first: 100) {
						totalCount
						nodes {
							replies {
								totalCount
							}
						}
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	}
`;

export async function getGiscusCommentCounts(): Promise<GiscusCommentCounts> {
	if (!giscusConfig.enable) return {};

	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		console.warn(
			"GITHUB_TOKEN is not set; archive comment counts will default to zero.",
		);
		return {};
	}

	const [owner, name] = giscusConfig.repo.split("/");
	const counts: GiscusCommentCounts = {};
	let after: string | null = null;

	do {
		const response = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: {
				Accept: "application/vnd.github+json",
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
				"X-GitHub-Api-Version": "2022-11-28",
			},
			body: JSON.stringify({
				query: discussionsQuery,
				variables: { owner, name, after },
			}),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch Giscus comment counts: ${response.status} ${response.statusText}`,
			);
		}

		const result = (await response.json()) as DiscussionsResponse;
		if (result.errors?.length) {
			throw new Error(
				`Failed to fetch Giscus comment counts: ${result.errors.map(({ message }) => message).join("; ")}`,
			);
		}

		const discussions = result.data?.repository?.discussions;
		if (!discussions) break;

		for (const discussion of discussions.nodes) {
			const replyCount = discussion.comments.nodes.reduce(
				(total, comment) => total + comment.replies.totalCount,
				0,
			);
			counts[discussion.title] = discussion.comments.totalCount + replyCount;
		}

		after = discussions.pageInfo.hasNextPage
			? discussions.pageInfo.endCursor
			: null;
	} while (after);

	return counts;
}
