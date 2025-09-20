# frommiddle モノレポ プロジェクト構成

## モノレポ構成

本プロジェクトは **pnpm workspaces** と **Turborepo** を利用したモノレポ構成を採用し、  
AWS CDK によるインフラコードと Web アプリケーション（SPA）を一元管理します。  
開発・CI/CD・デプロイまでを一貫して扱えるよう設計されています。

### ディレクトリ構成

```text
[project-root]/
├── apps/                          # アプリケーション群
│   └── web/                       # Webフロントエンド (React SPA)
│       ├── src/
│       │   ├── components/        # Reactコンポーネント
│       │   ├── hooks/             # カスタムフック
│       │   ├── lib/               # 共通ユーティリティ
│       │   └── styles/            # Tailwind / グローバルスタイル
│       ├── public/                # 静的アセット
│       ├── package.json
│       └── vite.config.ts         # Vite 設定 (Next.jsは利用しない)
│
├── packages/                      # 共通ライブラリ群
│   ├── cdk-utils/                 # AWS CDK ユーティリティ
│   │   ├── src/                   # CDK用共通関数・型
│   │   └── package.json
│   │
│   ├── cdk-constructs/            # 再利用可能なCDKコンストラクト
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── name-builder/              # リソース命名規則の共通化
│   │   ├── src/
│   │   └── package.json
│   │
│   └── meta-util/                 # ステージ/環境メタ情報の共通化
│       ├── src/
│       └── package.json
│
├── infrastructure/                # IaC (AWS CDK)
│   ├── stacks/                    # 環境別スタック定義 (dev/prod)
│   ├── bin/                       # CDKアプリのエントリポイント
│   └── cdk.json
│
├── tools/                         # 開発支援用ツール群
│   ├── tsconfig/                  # 共通TypeScript設定
│   └── eslint-config/             # 共通ESLintルール
│
├── .github/                       # GitHub Actions ワークフロー
│   └── workflows/
│       ├── ci.yml                 # CI (lint/test/build)
│       ├── deploy.yml             # CDKデプロイ
│       └── quality.yml            # Gitleaks/静的解析
│
├── .husky/                        # Git Hooks (pre-commit, pre-push)
├── package.json                   # ルートスクリプト & ワークスペース定義
├── pnpm-workspace.yaml            # ワークスペース設定
├── turbo.json                     # Turborepo タスク設定
├── .gitignore
├── .gitleaksignore
└── README.md
```

---

## パッケージ依存関係

### ワークスペース依存関係

```text
apps/web
├── @frommiddle/cdk-utils (workspace:*)
├── @frommiddle/cdk-constructs (workspace:*)
├── @frommiddle/name-builder (workspace:*)
├── @frommiddle/meta-util (workspace:*)
└── @frommiddle/tsconfig (workspace:*)
```

### 外部依存関係

- **フロントエンド**: React, Vite, Tailwind CSS, React Query
- **インフラ**: AWS CDK, aws-sdk
- **開発基盤**: TypeScript, ESLint, Prettier, Turborepo, Husky, Gitleaks

---

## ファイル命名規則

- **ディレクトリ**: kebab-case (例: `user-management`)
- **通常のファイル**: kebab-case (例: `api-client.ts`)
- **Reactコンポーネント**: PascalCase (例: `UserProfile.tsx`)
- **型定義**: PascalCase (例: `UserData.ts`)
- **定数**: UPPER_SNAKE_CASE (例: `API_ENDPOINTS.ts`)

---

## ビルドと出力構成

### 開発ビルド

```text
apps/web/dist/                     # Vite のビルド成果物
packages/*/dist/                   # 各パッケージの型/JS出力
```

### 本番ビルド

```text
dist/
├── web/                           # S3 配信用の SPA ビルド
└── infrastructure/                # CDK の合成テンプレート (cdk synth)
```

---

## 設定ファイル

### ルート

- `package.json` - 共通スクリプト, devDependencies
- `pnpm-workspace.yaml` - ワークスペース定義
- `turbo.json` - タスク依存関係
- `.gitignore`, `.gitleaksignore`

### 各パッケージ

- `package.json` - 個別依存関係
- `tsconfig.json` - 型チェック設定
- `.eslintrc.js` - ESLint設定

### 環境変数

- `.env.development` - 開発用
- `.env.production` - 本番用

---

## 開発ワークフロー

### ローカル

1. 依存解決: `pnpm install`
2. 開発サーバ起動: `pnpm --filter web dev`
3. Lint: `pnpm turbo run lint`
4. Test: `pnpm turbo run test`
5. Build: `pnpm turbo run build`

### インフラ

1. CDKスタック開発: `pnpm --filter infrastructure cdk synth`
2. デプロイ: GitHub Actions (`deploy.yml`) 経由

---

## ベストプラクティス

- **コード整理**: 機能単位でディレクトリ分割し、Barrel export (`index.ts`) を活用
- **依存関係**: 内部パッケージは workspace:\* を利用、peerDependencies で共通ライブラリを管理
- **テスト戦略**:
  - 単体テスト: 各パッケージの `__tests__/`
  - E2Eテスト: `apps/web/tests/`
  - CDKテスト: `infrastructure/tests/`
- **ドキュメント**:
  - 各パッケージに README
  - `docs/` にアーキテクチャと運用手順を記録
