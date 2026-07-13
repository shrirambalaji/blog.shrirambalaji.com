import { expect, test } from "@playwright/test";

test("writing metadata, feed, and sitemap use the public same-origin URLs", async ({
	page,
	request,
}) => {
	await page.goto("/writing/posts");

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://www.shrirambalaji.com/writing/posts",
	);
	await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
		"href",
		"/writing/rss.xml",
	);
	await expect(page.locator('link[rel="sitemap"]')).toHaveAttribute("href", "/writing/sitemap.xml");

	const sitemapResponse = await request.get("/writing/sitemap.xml");
	expect(sitemapResponse.ok()).toBe(true);
	expect(await sitemapResponse.text()).toContain(
		"<loc>https://www.shrirambalaji.com/writing/posts/resolving-rust-symbols</loc>",
	);

	const feedResponse = await request.get("/rss.xml");
	expect(feedResponse.ok()).toBe(true);
	expect(await feedResponse.text()).toContain(
		"https://www.shrirambalaji.com/writing/posts/resolving-rust-symbols/",
	);

	const writingFeedResponse = await request.get("/writing/rss.xml");
	expect(writingFeedResponse.ok()).toBe(true);
	expect(await writingFeedResponse.text()).toContain(
		"https://www.shrirambalaji.com/writing/posts/resolving-rust-symbols/",
	);
});

test("legacy writing URLs redirect to the canonical writing hierarchy", async ({ page }) => {
	await page.goto("/posts/oss/rust/learnings-from-contributing-to-the-rust-project");
	await expect(page).toHaveURL(
		/\/writing\/posts\/oss\/rust\/learnings-from-contributing-to-the-rust-project$/,
	);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Learnings from Contributing to the Rust Project",
		}),
	).toBeVisible();

	await page.goto("/tags/rust");
	await expect(page).toHaveURL(/\/writing\/tags\/rust$/);

	await page.goto("/series/advent-of-code-2020");
	await expect(page).toHaveURL(/\/writing\/series\/advent-of-code-2020$/);
});

test("blog presents writing as part of the main site", async ({ page }) => {
	await page.goto("/writing/posts");

	const primaryNav = page.getByRole("navigation", { name: "Primary" });
	await expect(
		page.getByRole("banner").getByRole("link", { name: "Shriram Balaji" }),
	).toHaveAttribute("href", "https://www.shrirambalaji.com/");
	await expect(primaryNav.getByRole("link", { name: "Writing" })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await expect(primaryNav.getByRole("link", { name: "Projects" })).toHaveAttribute(
		"href",
		"https://www.shrirambalaji.com/#projects",
	);
	await expect(page.getByRole("region", { name: "Blog post list" })).toBeVisible();

	const firstPost = page.getByRole("region", { name: "Blog post list" }).getByRole("link").first();
	await firstPost.click();
	await expect(page.locator("article[data-pagefind-body]")).toBeVisible();
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("blog shares the main site's dark palette and compact type", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/writing/posts");

	await expect(page.locator("body")).toHaveCSS("background-color", "rgb(17, 17, 24)");
	await expect(page.locator("body")).toHaveCSS("color", "rgb(224, 224, 235)");
	await expect(
		page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Writing" }),
	).toHaveCSS("font-size", "14px");
	await expect(page.locator("header.site-intro-fade")).toHaveCSS("animation-duration", "0.56s");
	await expect(page.locator("main.page-content > :not(.to-top-button)").first()).toHaveCSS(
		"animation-name",
		"fade-up-in",
	);
});

test("mobile navigation opens, identifies Writing, and closes with Escape", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/writing/posts");

	await page.getByRole("button", { name: "Open navigation" }).click();
	const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
	await expect(mobileNav).toBeVisible();
	await expect(mobileNav.getByRole("link", { name: "Writing" })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await page.keyboard.press("Escape");
	await expect(mobileNav).toBeHidden();
});

test("article content uses the shared editorial system", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/writing/posts/resolving-rust-symbols");

	const article = page.locator("article[data-pagefind-body]");
	await expect(
		article.getByRole("heading", { level: 1, name: "Resolving Rust Symbols" }),
	).toBeVisible();
	await expect(article.locator(".article-cover")).toHaveCSS("border-width", "0px");
	await expect(article.locator(".article-tags")).toContainText("rust");
	await expect(article.locator(".article-prose p").first()).toHaveCSS("font-size", "15px");
	await expect(article.locator(".article-prose p").first()).toHaveCSS("line-height", "27px");
	await expect(article.locator(".article-prose p").first()).toHaveCSS("margin-bottom", "12px");
	await expect(article.locator(".article-prose h2").first()).toHaveCSS("font-size", "20px");
	await expect(article.locator(".article-prose h2").first()).toHaveCSS("margin-top", "32px");
	await expect(page.getByRole("heading", { level: 2, name: "On this page" })).toBeVisible();

	await page.goto("/writing/posts/linkerland/devlogs/001-writing-a-linker-map-parser");
	await expect(page.locator(".callout").first()).toHaveCSS("border-left-width", "2px");
	await expect(page.locator(".expressive-code").first()).toBeVisible();
	await expect(
		page.locator(".article-prose details summary").filter({ hasText: "Reasons for choosing" }),
	).toHaveCSS("list-style-type", "none");

	await page.goto("/writing/posts/oss/rust/learnings-from-contributing-to-the-rust-project");
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Learnings from Contributing to the Rust Project",
		}),
	).toHaveCSS("font-size", "22px");
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Learnings from Contributing to the Rust Project",
		}),
	).toHaveCSS("line-height", "29.04px");
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Learnings from Contributing to the Rust Project",
		}),
	).toHaveCSS("width", "712px");
	await expect(page.locator(".article-cover")).toHaveCSS("width", "544px");
	await expect(page.locator(".article-cover__image")).toHaveCSS("width", "544px");
	await expect(page.locator(".expressive-code pre code").first()).toHaveCSS("font-size", "13px");
	await expect(page.locator(".themed-image-frame").first()).toHaveCSS("width", "712px");
	await expect(page.locator(".themed-image").first()).toHaveCSS("width", "512px");
	await expect(page.locator('a[href*="bootstrapping"] .external-link-icon')).toHaveCSS(
		"margin-left",
		"4px",
	);

	await page.goto("/writing/posts/rust-aoc/2020/day-05");
	const seriesNav = page.getByRole("navigation", { name: "Advent of Code 2020 series navigation" });
	await expect(seriesNav).toBeVisible();
	await expect(seriesNav.getByRole("link", { name: "Previous", exact: false })).toBeVisible();
	await expect(seriesNav.getByRole("link", { name: "Next", exact: false })).toBeVisible();
});
