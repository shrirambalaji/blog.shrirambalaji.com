import { getAllPosts, getUniqueSeries, getUniqueTags, slugify } from "@/utils";

const publicOrigin = "https://www.shrirambalaji.com";

const escapeXml = (value: string): string =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");

export const GET = async (): Promise<Response> => {
	const posts = await getAllPosts();
	const paths = new Set<string>([
		"/writing/posts",
		"/writing/tags",
		...posts.map((post) => `/writing/posts/${post.id}`),
		...getUniqueTags(posts).map((tag) => `/writing/tags/${encodeURIComponent(tag)}`),
		...getUniqueSeries(posts).map((series) => `/writing/series/${slugify(series)}`),
	]);
	const urls = [...paths]
		.map((path) => `<url><loc>${escapeXml(new URL(path, publicOrigin).href)}</loc></url>`)
		.join("");
	const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

	return new Response(xml, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
