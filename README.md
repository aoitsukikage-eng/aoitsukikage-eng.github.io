# aoitsukikage-eng.github.io

Minimal Astro bootstrap for the `aoitsukikage-eng.github.io` GitHub Pages user site.

## Local Development

Use the locked Node version before installing dependencies:

```sh
nvm use
npm ci
```

Start the local dev server:

```sh
npm run dev
```

The placeholder homepage is served at `http://localhost:4321/`.

## Build

Create the static output in `dist/`:

```sh
npm run build
```

Preview the built output locally if needed:

```sh
npm run preview
```

## Deployment

Deployment is handled by GitHub Actions through `.github/workflows/deploy.yml`.

1. Push `main` to the GitHub repository named `aoitsukikage-eng.github.io`.
2. In GitHub Pages settings, choose `GitHub Actions` as the source.
3. The workflow runs `npm ci`, `npm run build`, then deploys the generated `dist/` artifact with `actions/deploy-pages`.

## `site` And `base`

- `site` is set to `https://aoitsukikage-eng.github.io` so Astro generates canonical production URLs for the final user site domain.
- `base` is set to `/` because this is a GitHub Pages user site, not a project site. Using `/repo-name` here would break asset paths and cause a blank page after deploy.
