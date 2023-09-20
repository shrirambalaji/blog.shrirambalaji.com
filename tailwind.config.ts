import { apply } from "node_modules/astro/dist/core/polyfill";
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
	darkMode: "class",
	corePlugins: {
		// disable aspect ratio as per docs -> @tailwindcss/aspect-ratio
		aspectRatio: false,
		// disable some core plugins as they are included in the css, even when unused
		touchAction: false,
		ringOffsetWidth: false,
		ringOffsetColor: false,
		scrollSnapType: false,
		borderOpacity: false,
		textOpacity: false,
		fontVariantNumeric: false,
	},
	theme: {
		extend: {
			colors: {
				bgColor: "hsl(var(--theme-bg) / <alpha-value>)",
				textColor: "hsl(var(--theme-text) / <alpha-value>)",
				link: "hsl(var(--theme-link) / <alpha-value>)",
				accent: "hsl(var(--theme-accent) / <alpha-value>)",
				"accent-2": "hsl(var(--theme-accent-2) / <alpha-value>)",
				quote: "hsl(var(--theme-quote) / <alpha-value>)",
				ghostindigo: {
					DEFAULT: "#111118",
					50: "#EAEAF0",
					100: "#DBDBE6",
					200: "#BDBDD1",
					300: "#A0A0BB",
					400: "#8282A6",
					500: "#66668F",
					600: "#505072",
					700: "#3B3B54",
					800: "#262636",
					900: "#111118",
				},
			},
			boxShadow: {
				"2.5xl": "0px 0px 30px -10px #111118",
				"3xl": "0px 0px 30px 0px #111118",
			},
			fontFamily: {
				// Add any custom fonts here
				mono: ["JetBrains Mono Variable", "JetBrains Mono", ...fontFamily.mono],
				sans: ["InterVariable", "Inter", ...fontFamily.sans],
				serif: [...fontFamily.serif],
			},
			transitionProperty: {
				height: "height",
			},
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			// Remove above once tailwindcss exposes theme type
			typography: (theme) => ({
				astro: {
					css: {
						"--tw-prose-body": theme("colors.textColor / 1"),
						"--tw-prose-headings": theme("colors.accent-2 / 1"),
						"--tw-prose-links": theme("colors.textColor / 1"),
						"--tw-prose-bold": theme("colors.textColor / 1"),
						"--tw-prose-bullets": theme("colors.textColor / 1"),
						"--tw-prose-quotes": theme("colors.quote / 1"),
						"--tw-prose-quote-borders": theme("colors.quote / 1"),
						"--tw-prose-pre-bg": theme("colors.bgColor / 1"),
						"--tw-prose-code": theme("colors.textColor / 1"),
						"--tw-prose-hr": "0.5px dashed #666",
						"--tw-prose-th-borders": "#666",
					},
				},
				DEFAULT: {
					css: {
						a: {
							"@apply astro-link no-underline": "",
						},
						strong: {
							fontWeight: "700",
						},
						code: {
							padding: "5px",
							borderRadius: "6px",
							backgroundColor: "var(--astro-code-color-background)",
						},
						blockquote: {
							borderLeftWidth: "0",
						},
						hr: {
							borderTopStyle: "dashed",
						},
						thead: {
							borderBottomWidth: "none",
						},
						"thead th": {
							fontWeight: "700",
							borderBottom: "1px dashed #666",
						},
						"tbody tr": {
							borderBottomWidth: "none",
						},
						tfoot: {
							borderTop: "1px dashed #666",
						},
						sup: {
							"@apply ms-0.5": "",
							a: {
								"@apply bg-none": "",
								"&:hover": {
									"@apply text-link no-underline bg-none": "",
								},
								"&:before": {
									content: "'['",
								},
								"&:after": {
									content: "']'",
								},
							},
						},
					},
				},
				sm: {
					css: {
						code: {
							fontSize: theme("fontSize.sm")[0],
							fontWeight: "400",
						},
					},
				},
			}),
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/aspect-ratio"),
		plugin(function ({ addComponents }) {
			addComponents({
				".astro-link": {},
				".title": {
					"@apply text-3xl font-bold text-accent-2": {},
				},
			});
		}),
	],
} satisfies Config;
