import { defineConfig } from "astro/config";
import fs from "fs";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import remarkUnwrapImages from "remark-unwrap-images";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";
import embeds from "astro-embed/integration";
import shikiji from "rehype-shikiji";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
	site: "https://blog.shrirambalaji.com",
	markdown: {
		syntaxHighlight: false,
		rehypePlugins: [
			[
				shikiji,
				{
					themes: {
						light: "github-light",
						dark: "github-dark",
					},
				},
			],
			[
				rehypeExternalLinks,
				{
					content: {
						type: "element",
						tagName: "svg",
						properties: {
							viewBox: "0 0 20 20",
							fill: "currentColor",
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
		],
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime],
		remarkRehype: { footnoteLabelProperties: { className: [""] } },
	},
	image: {
		domains: ["og.shrirambalaji.com"],
	},
	integrations: [
		embeds(),
		mdx({}),
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
		prefetch(),
	],
	vite: {
		plugins: [rawFonts([".ttf"])],
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
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
