import { defineConfig } from "astro/config";
import fs from "fs";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import remarkUnwrapImages from "remark-unwrap-images";
// @ts-ignore:next-line
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";
import embeds from "astro-embed/integration";

// https://astro.build/config
export default defineConfig({
	site: "https://blog.shrirambalaji.com",
	markdown: {
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime],
		remarkRehype: { footnoteLabelProperties: { className: [""] } },
		shikiConfig: {
			theme: "css-variables",
			wrap: true,
		},
	},
	image: {
		service: "og.shrirambalaji.com",
		domains: ["og.shrirambalaji.com"],
	},
	integrations: [
		mdx({}),
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
		prefetch(),
		embeds(),
	],
	vite: {
		plugins: [rawFonts([".ttf"])],
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
});

function rawFonts(ext: Array<string>) {
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
