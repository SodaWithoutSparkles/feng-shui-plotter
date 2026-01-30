# Feng Shui Plotter — Development Guide 🔧

This document contains development and contribution information for the Feng Shui Plotter project.

## Tech stack

- Frontend: React + TypeScript
- Bundler: Vite
- UI: Tailwind CSS
- Canvas: Konva / react-konva

## Prerequisites

- Node.js 18+ (recommended)
- npm (comes with Node.js)

## Quick start (local development)

```bash
# install dependencies
npm install

# start dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

## Project structure (high level)

- `src/` — application source code
  - `components/` — UI components, including `help/sections` (user-facing help content)
  - `utils/` — shared utilities (e.g. FengShui calculations)
- `docs/` — local docs and translations

## Notes for contributors

- Help content is kept under `src/components/help/sections`. When updating the app, ensure help text remains consistent across locales (`zh-hant`, `zh-hans`, `en`).
- Project state saving uses a compression helper (`src/utils/compress.ts`) and autosaves to `localStorage`.
- Exports are available from the canvas export UI (see `src/components/canvas/hooks/export`).

## Deployment

The project is currently deployed to GitHub Pages at:

https://sodawithoutsparkles.github.io/feng-shui-plotter/

For automated deployments, you can use any GitHub Pages workflow or tooling that publishes `dist/` after `npm run build`.

## License

This repository currently does not include a LICENSE file. Please add a license (e.g., MIT) to clarify usage and contribution terms.

## Contributing

- Please open issues for feature requests or bug reports.
- Fork the repo, create a branch per feature/fix, and open a PR with a clear description and any relevant screenshots.

Thanks for contributing! 🙏