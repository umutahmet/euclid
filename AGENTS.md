# Repository Guidelines

## Project Structure & Module Organization

Euclid couples a Vite/React client with a Cloudflare Worker edge API. React sources live in `src/`; bootstrap code in `main.tsx` mounts feature modules grouped by domain (`src/canvas`, `src/journal`, etc.). Keep presentation styles colocated via Tailwind utilities or a nearby `.css` file imported by the component. Static assets, favicons, and the HTML shell live in `public/`. Worker routes belong in `worker/index.ts`, with bindings typed in `worker-configuration.d.ts`. Strategic notes live in `docs/`, starting with `docs/PROJECT.md`.

## Build, Test, and Development Commands

Use pnpm consistently. `pnpm dev` starts Vite with HMR at http://localhost:5173. `pnpm build` runs the TypeScript project references and emits `dist/`. `pnpm lint` executes ESLint per `eslint.config.js`; resolve warnings before opening a PR. `pnpm preview` serves the built site for acceptance checks. `pnpm deploy` performs a full build and deploys via Wrangler using `wrangler.jsonc`. `pnpm cf-typegen` refreshes Worker environment typings after adding bindings or secrets.

## Coding Style & Naming Conventions

Write modern TypeScript and React function components. Follow two-space indentation, trailing commas, and semicolons, matching the scaffolded files. Use PascalCase for components and hooks (`VoicePanel`), camelCase for utilities (`buildBranchGraph`), and kebab-case for directories.

**Component Strategy:** Strictly use shadcn/ui components (`src/components/ui/`) as the primary building blocks for all UI elements. Install new shadcn components via `npx shadcn@latest add <component>` when needed. Manually creating components is a last resort reserved only for truly custom domain-specific widgets that have no shadcn equivalent. Prefer Tailwind 4 utilities for layout; when cascading styles are unavoidable, scope them to the component's `.css`. Keep modules under ~200 lines by extracting helpers into `src/lib` as needed.

## Testing Guidelines

Automated tests are not wired up, so logic-heavy contributions should also introduce Vitest and a `pnpm test` script. Place unit tests in `src/__tests__` or next to the component as `Name.test.tsx`, and assert user-facing behavior through React Testing Library. Mock Worker calls with lightweight fetch stubs. Aim for 25% coverage on new modules and document any manual QA steps (browsers exercised, Worker endpoints hit) in the PR description.

## Commit & Pull Request Guidelines

Write imperative, present-tense commit subjects (`Add canvas node renderer`) similar to the concise history. Keep each commit focused on a single concern and include context in the body when motivation is not obvious. Pull requests must summarize the change, link issues, list verification steps (`pnpm lint`, manual canvas walkthrough, etc.), and attach screenshots or terminal captures for UI or Worker changes. Call out follow-up work or migrations so reviewers can plan deployments, and avoid mixing refactors with features unless unavoidable.
