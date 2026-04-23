<div align="center">
  <a href="https://twenty.com">
    <picture>
      <img alt="Twenty logo" src="https://raw.githubusercontent.com/twentyhq/twenty/2f25922f4cd5bd61e1427c57c4f8ea224e1d552c/packages/twenty-website/public/images/core/logo.svg" height="128">
    </picture>
  </a>
  <h1>Create Twenty App</h1>

<a href="https://www.npmjs.com/package/create-twenty-app"><img alt="NPM version" src="https://img.shields.io/npm/v/create-twenty-app.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/twentyhq/twenty/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://discord.gg/cx5n4Jzs57"><img alt="Join the community on Discord" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=Twenty&labelColor=000000&logoWidth=20"></a>

</div>

The official scaffolding CLI for building apps on top of [Twenty CRM](https://twenty.com). Sets up a ready-to-run project with [twenty-sdk](https://www.npmjs.com/package/twenty-sdk).

## Quick start

```bash
npx create-twenty-app@latest my-twenty-app
cd my-twenty-app

# The scaffolder can automatically:
# 1. Start a local Twenty server (Docker)
# 2. Open the browser to log in (tim@apple.dev / tim@apple.dev)
# 3. Authenticate your app via OAuth

# Or do it manually:
yarn twenty server start          # Start local Twenty server
yarn twenty remote add --local    # Authenticate via OAuth

# Start dev mode: watches, builds, and syncs local changes to your workspace
# (also auto-generates typed CoreApiClient — MetadataApiClient ships pre-built — both available via `twenty-client-sdk`)
yarn twenty dev
```

The scaffolder will:

1. Create a new project with TypeScript, linting, tests, and a preconfigured `twenty` CLI
2. Optionally start a local Twenty server (Docker)
3. Open the browser for OAuth authentication

## Options

| Flag                           | Description                             |
| ------------------------------ | --------------------------------------- |
| `--example <name>`             | Initialize from an example              |
| `--name <name>`                | Set the app name (skips the prompt)     |
| `--display-name <displayName>` | Set the display name (skips the prompt) |
| `--description <description>`  | Set the description (skips the prompt)  |
| `--skip-local-instance`        | Skip the local server setup prompt      |

By default (no flags), a minimal app is generated with core files and an integration test. Use `--example` to start from a richer example:

```bash
npx create-twenty-app@latest my-twenty-app --example hello-world
```

Examples are sourced from [twentyhq/twenty/packages/twenty-apps/examples](https://github.com/twentyhq/twenty/tree/main/packages/twenty-apps/examples).

## Documentation

Full documentation is available at **[docs.twenty.com/developers/extend/apps](https://docs.twenty.com/developers/extend/apps/getting-started)**:

**Example files (controlled by scaffolding mode):**

- `objects/example-object.ts` — Example custom object with a text field
- `fields/example-field.ts` — Example standalone field extending the example object
- `logic-functions/hello-world.ts` — Example logic function with HTTP trigger
- `front-components/hello-world.tsx` — Example front component
- `views/example-view.ts` — Example saved view for the example object
- `navigation-menu-items/example-navigation-menu-item.ts` — Example sidebar navigation link
- `skills/example-skill.ts` — Example AI agent skill definition
- `__tests__/app-install.integration-test.ts` — Integration test that builds, installs, and verifies the app (includes `vitest.config.ts`, `tsconfig.spec.json`, and a setup file)

## Local server

The scaffolder can start a local Twenty dev server for you (all-in-one Docker image with PostgreSQL, Redis, server, and worker). You can also manage it manually:

```bash
yarn twenty server start     # Start (pulls image if needed)
yarn twenty server status    # Check if it's healthy
yarn twenty server logs      # Stream logs
yarn twenty server stop      # Stop (data is preserved)
yarn twenty server reset     # Wipe all data and start fresh
```

The server is pre-seeded with a workspace and user (`tim@apple.dev` / `tim@apple.dev`).

### How to use a local Twenty instance

If you're already running a local Twenty instance, you can connect to it instead of using Docker. Pass the port your local server is listening on (default: `3000`):

```bash
npx create-twenty-app@latest my-app --port 3000
```

## Next steps

- Run `yarn twenty help` to see all available commands.
- Use `yarn twenty remote add --local` to authenticate with your Twenty workspace via OAuth.
- Explore the generated project and add your first entity with `yarn twenty add` (logic functions, front components, objects, roles, views, navigation menu items, skills).
- Use `yarn twenty dev` while you iterate — it watches, builds, and syncs changes to your workspace in real time.
- `CoreApiClient` is auto-generated by `yarn twenty dev`. `MetadataApiClient` (for workspace configuration and file uploads via `/metadata`) ships pre-built with the SDK. Both are available via `import { CoreApiClient } from 'twenty-client-sdk/core'` and `import { MetadataApiClient } from 'twenty-client-sdk/metadata'`.

## Build and publish your application

Once your app is ready, build and publish it using the CLI:

```bash
# Build the app (output goes to .twenty/output/)
yarn twenty build

# Build and create a tarball (.tgz) for distribution
yarn twenty build --tarball

# Publish to npm (requires npm login)
yarn twenty publish

# Publish with a dist-tag (e.g. beta, next)
yarn twenty publish --tag beta

# Deploy directly to a Twenty server (builds, uploads, and installs in one step)
yarn twenty deploy
```

### Publish to the Twenty marketplace

You can also contribute your application to the curated marketplace:

```bash
git clone https://github.com/twentyhq/twenty.git
cd twenty
git checkout -b feature/my-awesome-app
```

- Copy your app folder into `twenty/packages/twenty-apps`.
- Commit your changes and open a pull request on https://github.com/twentyhq/twenty

Our team reviews contributions for quality, security, and reusability before merging.

## Troubleshooting

- Server not starting: check Docker is running (`docker info`), then try `yarn twenty server logs`.
- Auth not working: make sure you are logged in to Twenty in the browser, then run `yarn twenty remote add`.
- Types not generated: ensure `yarn twenty dev` is running — it auto-generates the typed client.

## Contributing

- See our [GitHub](https://github.com/twentyhq/twenty)
- Join our [Discord](https://discord.gg/cx5n4Jzs57)
