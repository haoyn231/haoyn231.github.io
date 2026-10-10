import { definePlugin } from "@expressive-code/core";

/**
 * Turns a regular fenced code block into a fully collapsed block when its
 * metadata contains `fold`. The collapsible-sections plugin performs the
 * actual rendering, so syntax highlighting and the copy button keep working.
 *
 * Example: ```bash title="完整脚本" fold
 */
export function pluginFoldedCodeBlock() {
	return definePlugin({
		name: "Folded code block",
		hooks: {
			preprocessMetadata: ({ codeBlock }) => {
				if (codeBlock.metaOptions.getBoolean("fold") !== true) return;

				const lineCount = codeBlock.getLines().length;
				if (lineCount === 0) return;

				codeBlock.meta = [
					codeBlock.meta,
					`collapse={1-${lineCount}}`,
					'collapseStyle="collapsible-start"',
				]
					.filter(Boolean)
					.join(" ");
			},
		},
	});
}
