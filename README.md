# Work Buddy

macOS Electron application foundation built with Electron Forge, Vite, React,
TypeScript, Tailwind CSS, and shadcn/ui.

## Requirements

- Node.js 22.12 or newer
- Corepack enabled so the project uses its pinned pnpm version

```sh
corepack enable pnpm
pnpm install
```

## Development

```sh
pnpm start
```

## Checks and packaging

```sh
pnpm lint
pnpm typecheck
pnpm package
pnpm make
```

`pnpm make` currently creates an unsigned macOS ZIP in `out/make`. Add a DMG
maker alongside ZIP when the application is ready for signed and notarized
distribution.
