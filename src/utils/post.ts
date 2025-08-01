import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

/** Note: this function filters out draft posts based on the environment */
export async function getAllPosts() {
	return await getCollection("post", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
}

export function sortMDByDate(posts: Array<CollectionEntry<"post">>) {
	return posts.sort((a, b) => {
		const aDate = new Date(a.data.updatedDate ?? a.data.publishDate).valueOf();
		const bDate = new Date(b.data.updatedDate ?? b.data.publishDate).valueOf();
		return bDate - aDate;
	});
}

export function getPostsGroupedBySeries(posts: Array<CollectionEntry<"post">>) {
	const seriesMap = new Map<string, CollectionEntry<"post">[]>();
	const standaloneePosts: CollectionEntry<"post">[] = [];

	// Group posts by series
	posts.forEach((post) => {
		const series = post.data.series;
		if (series) {
			if (!seriesMap.has(series)) {
				seriesMap.set(series, []);
			}
			seriesMap.get(series)!.push(post);
		} else {
			standaloneePosts.push(post);
		}
	});

	// Get the first post from each series (sorted by date)
	const seriesRepresentatives: CollectionEntry<"post">[] = [];
	seriesMap.forEach((seriesPosts) => {
		const sortedSeries = sortMDByDate(seriesPosts);
		const representative = {
			...sortedSeries[0],
			data: {
				...sortedSeries[0].data,
				// Mark as series representative with count
				seriesCount: seriesPosts.length,
				seriesPosts: sortedSeries,
			},
		};
		seriesRepresentatives.push(representative);
	});

	// Combine and sort all posts
	return sortMDByDate([...standaloneePosts, ...seriesRepresentatives]);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags(posts: Array<CollectionEntry<"post">>) {
	return posts.flatMap((post) => [...post.data.tags]);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTags(posts: Array<CollectionEntry<"post">>) {
	return [...new Set(getAllTags(posts))];
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTagsWithCount(
	posts: Array<CollectionEntry<"post">>,
): Array<[string, number]> {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllSeries(posts: Array<CollectionEntry<"post">>) {
	return posts.flatMap((post) => (post.data.series ? [post.data.series] : []));
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueSeries(posts: Array<CollectionEntry<"post">>) {
	return [...new Set(getAllSeries(posts))];
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueSeriesWithCount(
	posts: Array<CollectionEntry<"post">>,
): Array<[string, number]> {
	return [
		...getAllSeries(posts).reduce(
			(acc, s) => acc.set(s, (acc.get(s) || 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}

export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w\-]+/g, "") // Remove all non-word chars
		.replace(/\-\-+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text
}
