# AWS CDK Patterns (Monorepo)

## Guiding Principles

- **IaC 100%**: すべての AWS リソースは CDK で管理。コンソール手作業は禁止。
- **Stage-aware**: `dev`/`prod` など明示的ステージ。命名は `{app}-{stage}-{purpose}`。
- **Account split**: `dev` と `prod` は別 AWS アカウント。OIDC で GitHub Actions から AssumeRole。
- **Construct-first**: 共通インフラは `packages/cdk-constructs` に集約し再利用。
- **Least surprise**: バケット名/ドメイン/CI 環境変数は `name-builder` (utils) で一元生成。

## Common Constructs

- **S3 SPA Hosting**
  - S3(website) + CloudFront + Route53 + ACM.
  - SPA は 404→`/index.html`（ CF のエラーページ 200 返却）。
- **API (Hono on Lambda + API Gateway REST/HTTP)**
  - `NodejsFunction`(esbuild) で単一エントリ。`external` に AWS SDK v3 を除外。
  - 環境変数は `Stage` 毎に `cdk.json` or `context` から注入。
- **VPC optionality**
  - API はデフォルト VPC 外（コールドスタート配慮）。DB 利用時のみ VPC を opt-in。
- **Observability**
  - Lambda Powertools / CloudWatch Logs / X-Ray。アラームは最低限 `5XX` と `Throttle`。
- **Security Baseline**
  - S3 は Block Public Access(Except website bucket via CF OAI/Origin Access Control)。
  - WAF は必要に応じて CF の前段に。Secrets は SSM Parameter Store / Secrets Manager。

## Naming Convention

- Buckets: `{app}-{stage}-{asset}` (例: `frommiddle-dev-web-assets`)
- Domains: `{stage}.example.com` or `app.stage.example.com`
- Stacks: `{App}{Stage}{Scope}Stack` (例: `WebDevHostingStack`)

## Environment Matrix

| Stage | Account | Region         | Notes                       |
| ----: | :------ | :------------- | :-------------------------- |
|   dev | 1111…   | ap-northeast-1 | Preview deploy, cheap tiers |
|  prod | 2222…   | ap-northeast-1 | Real traffic, alarms strict |

## CDK Tips

- `NodejsFunction` は **DoD(“docker outside docker”) を不要**にするため、基本は **ローカル esbuild** を使う（CI でも同バージョンを使用）。
- 依存の取り込みは **関数単位**（entry によるツリーシェイク）。共有パッケージは `dependencies` で宣言し、未使用コードは sideEffects: false を活かす。
