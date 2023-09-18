import type { APIContext, GetStaticPaths } from "astro";
import { getEntryBySlug } from "astro:content";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { siteConfig } from "@/site-config";
import { getAllPosts, getFormattedDate } from "@/utils";

import Inter from "@/assets/Inter-Regular.ttf";
import InterBold from "@/assets/Inter-Bold.ttf";

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	// debug: true,
	fonts: [
		{
			name: "Inter",
			data: Buffer.from(Inter),
			weight: 400,
			style: "normal",
		},
		{
			name: "Inter",
			data: Buffer.from(InterBold),
			weight: 700,
			style: "normal",
		},
	],
};
//     <div className="bg-ghostindigo-900 text-fg flex min-h-screen w-full items-center justify-center">

const markup = (title: string, pubDate: string) =>
	html`<div
		tw="flex flex-col min-h-screen w-full h-full bg-[#111118] text-[#c9cacc] items-center justify-center"
	>
		<div tw="flex flex-col flex-1 w-full p-10 justify-center items-center">
			<p tw="text-2xl mb-0">${pubDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-center w-full p-10 text-xl">
			<div tw="flex items-center">
				<svg
					width="32"
					height="32"
					viewBox="0 0 512 512"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M177.64 203.037C176.65 193.226 172.401 185.605 164.895 180.173C157.388 174.741 147.2 172.025 134.331 172.025C125.587 172.025 118.204 173.241 112.182 175.673C106.16 178.024 101.541 181.308 98.3235 185.524C95.1888 189.74 93.6215 194.524 93.6215 199.875C93.4565 204.334 94.4052 208.226 96.4675 211.55C98.6122 214.874 101.541 217.752 105.253 220.184C108.965 222.536 113.255 224.603 118.122 226.387C122.989 228.089 128.186 229.549 133.713 230.765L156.48 236.116C167.534 238.548 177.681 241.791 186.92 245.845C196.159 249.899 204.161 254.885 210.925 260.804C217.689 266.722 222.928 273.695 226.64 281.722C230.434 289.748 232.373 298.95 232.455 309.328C232.373 324.571 228.413 337.786 220.577 348.975C212.822 360.082 201.603 368.717 186.92 374.879C172.319 380.96 154.707 384 134.084 384C113.626 384 95.8075 380.919 80.629 374.757C65.533 368.595 53.7366 359.474 45.24 347.394C36.8258 335.232 32.4125 320.193 32 302.275H83.8462C84.4236 310.625 86.8571 317.598 91.1467 323.192C95.5188 328.706 101.334 332.881 108.594 335.719C115.936 338.475 124.226 339.854 133.465 339.854C142.539 339.854 150.417 338.556 157.099 335.962C163.863 333.368 169.102 329.76 172.814 325.138C176.526 320.517 178.382 315.206 178.382 309.207C178.382 303.612 176.691 298.91 173.309 295.099C170.009 291.289 165.142 288.046 158.708 285.37C152.356 282.695 144.56 280.262 135.321 278.073L107.728 271.263C86.3622 266.155 69.4926 258.169 57.1188 247.305C44.745 236.44 38.5994 221.806 38.6818 203.401C38.5994 188.321 42.6827 175.146 50.9319 163.876C59.2636 152.607 70.6887 143.81 85.2073 137.486C99.7259 131.162 116.224 128 134.702 128C153.511 128 169.927 131.162 183.95 137.486C198.056 143.81 209.028 152.607 216.864 163.876C224.701 175.146 228.743 188.2 228.991 203.037H177.64Z"
						fill="url(#paint0_linear_4_6)"
					/>
					<path
						d="M268.494 380.473V131.405H369.959C388.602 131.405 404.152 134.121 416.608 139.553C429.065 144.986 438.427 152.526 444.697 162.174C450.966 171.741 454.101 182.767 454.101 195.253C454.101 204.982 452.121 213.536 448.162 220.914C444.202 228.211 438.757 234.211 431.828 238.913C424.981 243.534 417.145 246.818 408.318 248.764V251.196C417.969 251.602 427.002 254.277 435.417 259.223C443.913 264.168 450.801 271.101 456.081 280.019C461.36 288.856 464 299.396 464 311.639C464 324.854 460.659 336.651 453.977 347.029C447.378 357.326 437.603 365.474 424.651 371.474C411.7 377.473 395.738 380.473 376.765 380.473H268.494ZM322.073 337.421H365.752C380.683 337.421 391.572 334.624 398.419 329.03C405.266 323.355 408.689 315.814 408.689 306.409C408.689 299.518 406.998 293.437 403.616 288.167C400.234 282.897 395.408 278.762 389.139 275.762C382.952 272.763 375.569 271.263 366.989 271.263H322.073V337.421ZM322.073 235.629H361.792C369.134 235.629 375.651 234.373 381.343 231.859C387.117 229.265 391.655 225.616 394.954 220.914C398.336 216.212 400.027 210.577 400.027 204.01C400.027 195.01 396.769 187.754 390.252 182.24C383.818 176.727 374.661 173.971 362.782 173.971H322.073V235.629Z"
						fill="url(#paint1_linear_4_6)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_4_6"
							x1="80.0873"
							y1="145.026"
							x2="400.713"
							y2="403.23"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#B9BFFF" />
							<stop offset="0.973958" stop-color="#7269FF" />
						</linearGradient>
						<linearGradient
							id="paint1_linear_4_6"
							x1="80.0873"
							y1="145.026"
							x2="400.713"
							y2="403.23"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#B9BFFF" />
							<stop offset="0.973958" stop-color="#7269FF" />
						</linearGradient>
					</defs>
				</svg>
				<p tw="ml-3 font-semibold">${siteConfig.title}</p>
			</div>
			<p tw="ml-5 text-[#505072]">${siteConfig.handle}</p>
		</div>
	</div>`;

export async function GET({ params: { slug } }: APIContext) {
	const post = await getEntryBySlug("post", slug!);
	const title = post?.data.title ?? siteConfig.title;
	const postDate = getFormattedDate(
		post?.data.updatedDate ?? post?.data.publishDate ?? Date.now(),
		{
			weekday: "long",
			month: "long",
		},
	);
	const svg = await satori(markup(title, postDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getAllPosts();
	return posts.filter(({ data }) => !data.ogImage).map(({ slug }) => ({ params: { slug } }));
};
