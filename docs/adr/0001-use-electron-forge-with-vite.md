# Use Electron Forge with Vite

Use Electron Forge's first-party Vite and TypeScript integration for the desktop application. Forge provides the official Electron packaging pipeline while Vite is the required renderer toolchain; we accept that Forge still labels its Vite plugin experimental.

Start on the exactly pinned Forge `8.0.0-alpha.10` package set. Forge 7's transitive Git dependency is rejected by pnpm's supply-chain protection, while Forge 8 installs without weakening that protection; the prerelease risk is controlled through exact package versions and the pnpm lockfile.
