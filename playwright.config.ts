import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	fullyParallel: true,
	projects: [
		{
			name: "chrome-beta",
			use: { ...devices["Desktop Chrome"], channel: "chrome-beta" },
		},
	],
	testDir: "./tests",
	use: {
		baseURL: "http://127.0.0.1:4322",
		trace: "on-first-retry",
	},
	webServer: {
		command: "pnpm dev --host 127.0.0.1 --port 4322",
		port: 4322,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
