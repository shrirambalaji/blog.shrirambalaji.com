import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	return Array.from(new Set(array.map((item) => item.toLowerCase())));
}

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(60),
			description: z.string().max(250),
			publishDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			coverImage: z
				.object({
					src: image(),
					alt: z.string(),
					contain: z.boolean().optional(),
					border: z.boolean().optional(),
					shouldInvert: z.boolean().optional(),
				})
				.optional(),
			draft: z.boolean().default(false),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			ogImage: z.string().optional(),
			series: z.string().optional(),
		}),
});

export const collections = { post };
