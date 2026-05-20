# Turborepo Svelte starter

This is an unofficial starter Turborepo.

## Using this example

Run the following command:

```bash
bunx create-turbo@latest -e https://github.com/IslamZaoui/turbo-sveltekit-shadcn
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [sveltekit](https://kit.svelte.dev) app
- `@repo/ui`: a stub Svelte component library powered by [shadcn-svelte](https://shadcn-svelte.com) & [tailwind v4](https://tailwindcss.com/blog/tailwindcss-v4)
- `@repo/tsconfig`: `typescript` configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org) for static type checking
- [Biome](https://biomejs.dev) for code linting & formatting
- [Husky](https://typicode.github.io/husky) for managing git hooks
- [Lint-staged](https://github.com/lint-staged/lint-staged) for running linters on staged files

## Adding components

You can add components to the project by running the following command:

```bash
bun ui add <component-name>

# Example:
bun ui add button input
```

When adding a new component, make sure to update the dependencies correctly:
- Dependencies required by the `ui` package should go in `devDependencies`.
- Dependencies needed by the consuming app should be listed in `peerDependencies` of the `ui` package.
- Prefer using catalogs in `package.json` whenever possible.

## Migrating from bun to other package managers (pnpm for example)

- Remove `bun.lock` file from the root of the project.
- Create `pnpm-workspace.yaml` in the root of the project with the following content:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'

catalog:
	"typescript": "^6",
  ...and more (check the workspace field in `package.json` file)
```

- Remove `workspace` field from the `package.json` file.
- Update any script that uses `bun` to use `pnpm` instead. For example:

```diff
- "ui": "bun --cwd packages/ui ui"
+ "ui": "pnpm --filter @repo/ui ui"
```

- Replace `bun-types` and other bun related stuff with node

And you should be good to go!
