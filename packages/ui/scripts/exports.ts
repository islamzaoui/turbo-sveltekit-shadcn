/// <reference types="bun-types" />

import { promises as fs } from "node:fs";
import { basename, dirname } from "node:path";
import chokidar from "chokidar";
import { glob } from "glob";

const WATCH = process.argv.includes("--watch");
const DIST_DIR = "./dist";
const PKG_PATH = "./package.json";

const IGNORE = ["__package_types_tmp__"];
const IGNORE_PATTERNS = IGNORE.map((i) => `**/${i}/**`);

async function buildExports() {
	const exports: Record<string, Record<string, string> | string> = {};

	const opts = { cwd: DIST_DIR, ignore: IGNORE_PATTERNS };

	for (const file of await glob("**/index.js", opts)) {
		const folder = dirname(file);
		const key = folder === "." ? "." : `./${folder}`;

		exports[key] = {
			types: `./dist/${folder}/index.d.ts`,
			svelte: `./dist/${folder}/index.js`,
			default: `./dist/${folder}/index.js`,
		};
	}

	for (const file of await glob("*.js", opts)) {
		const name = basename(file, ".js");

		exports[`./${name}`] = {
			types: `./dist/${name}.d.ts`,
			default: `./dist/${file}`,
		};
	}

	for (const file of await glob("**/*.css", opts)) {
		exports[`./${file}`] = `./dist/${file}`;
	}

	return exports;
}

async function updatePackageJson() {
	try {
		const pkg = JSON.parse(await fs.readFile(PKG_PATH, "utf8"));

		pkg.exports = await buildExports();

		await fs.writeFile(PKG_PATH, `${JSON.stringify(pkg, null, "\t")}\n`);

		console.log("Updated package.json exports");
	} catch (err) {
		console.error("Failed to update package.json:", err);
	}
}

async function startWatcher() {
	await fs.mkdir(DIST_DIR, { recursive: true });

	let debounce: Timer | undefined;

	const watcher = chokidar.watch(DIST_DIR, {
		ignored: IGNORE_PATTERNS,
		ignoreInitial: true,
		awaitWriteFinish: {
			stabilityThreshold: 100,
			pollInterval: 25,
		},
	});

	const trigger = (path: string) => {
		if (!path.match(/\.(js|d\.ts|css)$/)) return;

		clearTimeout(debounce);

		debounce = setTimeout(() => {
			void updatePackageJson();
		}, 100);
	};

	watcher.on("add", trigger).on("change", trigger).on("unlink", trigger);

	console.log(`Watching ${DIST_DIR}...`);
}

async function main() {
	await updatePackageJson();

	if (!WATCH) return;

	await startWatcher();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
