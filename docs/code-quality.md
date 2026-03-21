# Code Quality — ESLint, Prettier, Husky, lint-staged

## Overview

| Tool        | Purpose                     | Config File                    |
| ----------- | --------------------------- | ------------------------------ |
| ESLint      | Linting TypeScript/React    | `eslint.config.mjs`            |
| Prettier    | Code formatting             | `.prettierrc`                  |
| Husky       | Git hooks                   | `.husky/pre-commit`            |
| lint-staged | Run linters on staged files | `package.json` → `lint-staged` |
| Dependabot  | Auto-update dependencies    | `.github/dependabot.yml`       |

## ESLint

Flat config (`eslint.config.mjs`) extends:

- `next/core-web-vitals` — Next.js recommended rules
- `next/typescript` — TypeScript-specific rules
- `prettier` — disables rules that conflict with Prettier

Custom rules:

- `@typescript-eslint/no-unused-vars: warn` — warns on unused vars (ignores `_`-prefixed)
- `@typescript-eslint/no-explicit-any: warn` — warns on `any` type

```bash
npm run lint
```

## Prettier

`.prettierrc` settings:

| Setting         | Value                         |
| --------------- | ----------------------------- |
| `singleQuote`   | `true`                        |
| `trailingComma` | `"all"`                       |
| `printWidth`    | `100`                         |
| `semi`          | `false`                       |
| `tabWidth`      | `2`                           |
| `plugins`       | `prettier-plugin-tailwindcss` |

The Tailwind plugin automatically sorts class names in the correct order.

```bash
npm run format         # format all files
npm run format:check   # check without modifying
```

Ignored paths (`.prettierignore`): `.next/`, `node_modules/`, `docker/`, `public/`.

## Husky + lint-staged

On every `git commit`, Husky runs lint-staged:

| File pattern                   | Actions                             |
| ------------------------------ | ----------------------------------- |
| `*.{ts,tsx,js,jsx,mjs}`        | `eslint --fix` → `prettier --write` |
| `*.{json,css,md,mdx,yml,yaml}` | `prettier --write`                  |

This ensures every committed file is linted and formatted. No manual `npm run format` needed before committing.

### How it works

1. `npm install` runs `prepare` script → installs Husky hooks
2. You `git commit`
3. `.husky/pre-commit` fires → runs `npx lint-staged`
4. lint-staged runs ESLint + Prettier only on staged files
5. If linting fails, commit is blocked

### Skipping hooks (emergency)

```bash
git commit --no-verify -m "emergency fix"
```

## Dependabot

`.github/dependabot.yml` is configured for:

- **npm dependencies** — weekly on Monday
  - Dev dependencies grouped (minor + patch)
  - Production dependencies grouped (patch only)
  - Max 10 open PRs
- **GitHub Actions** — weekly on Monday
  - Max 5 open PRs

## CI/CD (GitHub Actions)

`.github/workflows/ci.yml` runs on every push to `main` and every PR:

```
lint → test → build
```

| Job   | Command         | Purpose                                |
| ----- | --------------- | -------------------------------------- |
| lint  | `npm run lint`  | ESLint check                           |
| test  | `npm run test`  | Vitest unit tests                      |
| build | `npm run build` | Production build (catches type errors) |

Build runs after lint and test pass (dependency chain).

## Adding New Rules

### ESLint rule

Edit `eslint.config.mjs`:

```javascript
{
  rules: {
    'no-console': 'warn',    // add your rule
  },
}
```

### Prettier option

Edit `.prettierrc`:

```json
{
  "bracketSpacing": false
}
```
