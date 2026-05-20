import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),
		experimental: {
			async: true,
		},
	},
	preprocess: vitePreprocess(),
	kit: {
		alias: {
			"@": "./src",
			"@/*": "./src/*",
		},
	},
};

export default config;
