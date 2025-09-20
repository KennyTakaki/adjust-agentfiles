# Coding Standards

## Language & Tooling

- TypeScript 5.x / Node.js 22+（Lambda は 20.x ランタイム想定）。
- パッケージ管理は **pnpm**、タスクは **Turborepo**。
- Lint: ESLint / Format: Prettier（VS Code formatOnSave 有効）。

## Project Conventions

- **Module boundaries**: `apps/*` は実行物、`packages/*` は共有ライブラリ/constructs/utils。
- **Imports**: パスは TS path alias を使わず、**ワークスペース名**で解決（publish 容易化）。
- **Error handling**: `Result` 型 or 例外→ロギング→`cause` 連鎖。
- **Env**: `Zod` で起動時にバリデーション。
- **Testing**: Jest + React Testing Library（フロント） / CDK assertions（IaC）。
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`…)。`changeset` が必要なら追加。

## Lambda Packaging

- handler 単位で entry file を分離。`packages/functions/<domain>/<name>/index.ts`
- 共有依存は domain package に。**不要な依存の巻き込みを避ける**ため、関数ごとに import を最小化。

## Security

- gitleaks を pre-commit / pre-push に。Secrets は保存禁止。
- CI OIDC ロールは**最小権限**。`cd:*`, `s3:*` などワイルドカードは避ける。

## Docs

- 仕様は `product.md` / 技術は `tech.md`。PR は必ずどちらかへのリンクを含める。
