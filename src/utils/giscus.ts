const GISCUS_ORIGIN = "https://giscus.app";

export function getGiscusTermFromSlug(slug: string): string {
	return encodeURI(`/posts/${slug}/`).replace(/^\/+/, "");
}

function getTheme(): "light" | "transparent_dark" {
	return document.documentElement.classList.contains("dark")
		? "transparent_dark"
		: "light";
}

function syncGiscusTheme(): void {
	const iframe = document.querySelector<HTMLIFrameElement>(
		"iframe.giscus-frame",
	);
	iframe?.contentWindow?.postMessage(
		{
			giscus: {
				setConfig: {
					theme: getTheme(),
				},
			},
		},
		GISCUS_ORIGIN,
	);
}

let themeObserver: MutationObserver | undefined;

function observeTheme(): void {
	if (themeObserver) return;

	themeObserver = new MutationObserver(syncGiscusTheme);
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
}

export function initGiscusComments(): void {
	observeTheme();

	const container = document.querySelector<HTMLElement>(
		"[data-giscus-comments]",
	);
	if (!container || container.querySelector("script, iframe")) return;

	const script = document.createElement("script");
	script.src = `${GISCUS_ORIGIN}/client.js`;
	script.async = true;
	script.crossOrigin = "anonymous";
	script.dataset.repo = container.dataset.repo;
	script.dataset.repoId = container.dataset.repoId;
	script.dataset.category = container.dataset.category;
	script.dataset.categoryId = container.dataset.categoryId;
	script.dataset.mapping = container.dataset.mapping;
	script.dataset.strict = container.dataset.strict;
	script.dataset.reactionsEnabled = container.dataset.reactionsEnabled;
	script.dataset.emitMetadata = container.dataset.emitMetadata;
	script.dataset.inputPosition = container.dataset.inputPosition;
	script.dataset.theme = getTheme();
	script.dataset.lang = container.dataset.lang;
	script.dataset.loading = container.dataset.loading;
	script.addEventListener("load", syncGiscusTheme, { once: true });

	container.appendChild(script);
}
