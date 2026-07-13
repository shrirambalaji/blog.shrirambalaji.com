const blogAssetOrigin = "https://blog.shrirambalaji.com";

export const blogAssetUrl = (path: string): string =>
	new URL(path.replace(/^\/+/, ""), `${blogAssetOrigin}/`).href;
