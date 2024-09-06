import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import expressiveCode from "astro-expressive-code";
import { defineConfig } from "astro/config";
import fs from "fs";
import { h } from "hastscript";
import autolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkParse from "remark-parse";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";
import remarkDirective from "remark-directive"
import remarkCalloutDirectives from "@microflash/remark-callout-directives"
import githubCalloutOptions from "@microflash/remark-callout-directives/config/github"

const AnchorLinkIcon = h(
	"svg",
	{
		width: 16,
		height: 16,
		version: 1.1,
		viewBox: "0 0 16 16",
		xlmns: "http://www.w3.org/2000/svg",
	},
	h("path", {
		fillRule: "evenodd",
		fill: "currentcolor",
		d: "M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z",
	}),
);

// https://astro.build/config
export default defineConfig({
	site: "https://blog.shrirambalaji.com",
	markdown: {
		syntaxHighlight: "shiki",
		rehypePlugins: [
			rehypeHeadingIds,
			[
				rehypeExternalLinks,
				{
					content: {
						type: "element",
						tagName: "svg",
						properties: {
							viewBox: "0 0 20 20",
							fill: "#8282A6",
							class: "ml-4 w-4 h-4 inline-block",
						},
						children: [
							{
								type: "element",
								tagName: "path",
								properties: {
									"fill-rule": "evenodd",
									d: "M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z",
									"clip-rule": "evenodd",
								},
							},
							{
								type: "element",
								tagName: "path",
								properties: {
									"fill-rule": "evenodd",
									d: "M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z",
									"clip-rule": "evenodd",
								},
							},
						],
					},
				},
			],
			[
				autolinkHeadings,
				{
					behavior: "append",
					group: ({ tagName }) =>
						h(`div.heading-wrapper.level-${tagName}`, {
							tabIndex: -1,
						}),
					content: (heading) => [
						h(
							`span.anchor-icon`,
							{
								ariaHidden: "true",
							},
							AnchorLinkIcon,
						),
						// createSROnlyLabel(toString(heading)),
					],
				},
			],
		],
		remarkPlugins: [
		  remarkParse,
			remarkUnwrapImages,
			remarkReadingTime,
			remarkDirective,
			[remarkCalloutDirectives, { ...githubCalloutOptions }]
		],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""],
			},
		},
	},
	image: {
		domains: ["og.shrirambalaji.com"],
	},
	integrations: [
		expressiveCode({
			themes: ["min-dark", "min-light"],
			useDarkModeMediaQuery: false,
			frames: {
				showCopyToClipboardButton: false,
			},
			styleOverrides: {
				codeBackground: "var(--theme-code-bg)",
				codeFontSize: "1rem",
				borderColor: "var(--theme-code-border)",
				codeFontFamily:
					"JetBrains Mono Variable, JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				frames: {
					shadowColor: "transparent",
					editorTabBarBackground: "var(--theme-code-tabs)",
					editorActiveTabBackground: "var(--theme-code-active-tab)",
					editorActiveTabIndicatorBottomColor: "transparent",
					editorTabBarBorderBottomColor: "transparent",
					terminalTitlebarBackground: "var(--theme-code-tabs)",
					terminalTitlebarBorderBottom: "transparent",
					terminalBackground: "var(--theme-code-bg)",
				},
			},
		}),
		mdx({}),
		tailwind({}),
		sitemap(),
	],
	vite: {
		plugins: [rawFonts([".ttf"])],
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
	prefetch: true,
});
function rawFonts(ext) {
	return {
		name: "vite-plugin-raw-fonts",
		// @ts-ignore:next-line
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
