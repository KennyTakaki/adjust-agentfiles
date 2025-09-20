# frommiddle モノレポ 技術アーキテクチャ

## 技術スタック

### フロントエンド

- **React 18**: 最新の React（フック中心、コンカレント対応）
- **Vite**: 軽量かつ高速なフロントエンドビルドツール
- **TypeScript**: 型安全による開発効率と保守性向上
- **Tailwind CSS**: ユーティリティファーストな CSS フレームワーク
- **React Query**: サーバ状態の取得とキャッシュ管理

### バックエンド / API

- **Node.js**: サーバサイドのランタイム環境
- **TypeScript**: バックエンドコードの型安全化
- **Hono**: 軽量な Web フレームワーク（Lambda/API Gateway と相性良い）
- **GraphQL（将来的検討）**: 複雑なクエリに対応できる API 手段
- **Jest**: ユニットテストおよび統合テスト

### クラウドインフラ

- **AWS CDK**: IaC（Infrastructure as Code）
- **Amazon S3**: SPA のホスティング、静的アセットの配信
- **Amazon CloudFront**: CDN による高速配信
- **Amazon API Gateway + Lambda**: サーバレス API 基盤
- **Amazon DynamoDB**: 高スループットな NoSQL データストア
- **Amazon RDS（将来的検討）**: リレーショナルデータが必要な場合

### データ & 分析

- **DynamoDB**: 高速アクセスが必要なメタデータの保存
- **S3 + Athena（将来的検討）**: 分析用データの蓄積とクエリ
- **CloudWatch Logs / Metrics**: ログ・メトリクス収集
- **将来的選択肢**: Kinesis や Redshift による大規模解析

### 開発ツール

- **pnpm**: 高速かつ効率的なパッケージマネージャ
- **Turborepo**: モノレポ向けビルドシステム
- **ESLint + Prettier**: コード品質・スタイル統一
- **Husky**: Git フックによる品質チェック自動化
- **Gitleaks**: シークレット漏洩防止
- **GitHub Actions**: CI/CD パイプライン

---

## アーキテクチャパターン

### モノレポ構成

```text
frommiddle/
├── apps/
│   └── web/                # React SPA (Vite)
├── packages/
│   ├── cdk-utils/          # AWS CDKユーティリティ
│   ├── cdk-constructs/     # 共通CDKコンストラクト
│   ├── name-builder/       # リソース命名規則ユーティリティ
│   └── meta-util/          # ステージ/環境メタ情報
└── infrastructure/         # CDKによるIaC
```

### サービス分割の考え方

- **API Gateway + Lambda**: 中央のエントリーポイント
- **ランキング機能**: アルゴリズム実装を Lambda としてデプロイ
- **データ処理**: バッチ／リアルタイム処理を Lambda で実装
- **認証/認可**: Cognito or Lambda Authorizer
- **モニタリング**: CloudWatch + CDKモジュール

### イベント駆動設計

- **S3イベント**: データ追加時の Lambda トリガー
- **DynamoDB Streams**: データ更新イベントを別処理へ転送
- **SQS**: 非同期処理のキューイング
- **（将来的に）EventBridge**: サービス間連携のハブ

---

## データアーキテクチャ

### データフロー

1. **入力**: Web アプリ → API Gateway 経由でデータ送信
2. **処理**: Lambda で整形、DynamoDB/S3 へ保存
3. **格納**: 検索系データは DynamoDB、バルクデータは S3
4. **分析**: Athena / CloudWatch Logs Insights で分析
5. **配信**: API 経由でフロントに返却

### データベース設計（例）

```sql
Videos (id, title, creator_id, created_at)
Metrics (video_id, timestamp, views, likes, shares)
Rankings (video_id, rank, score, timestamp)
Users (id, email, role, created_at)
```

### キャッシュ戦略

- **CloudFront キャッシュ**: 静的ファイル配信
- **Lambda 内キャッシュ**: 短期のデータ再利用
- **DynamoDB DAX（将来的検討）**: キャッシュ強化

---

## セキュリティアーキテクチャ

### 認証・認可

- **JWT**: ステートレス認証
- **OAuth2.0（将来的）**: 外部サービス連携
- **RBAC**: ロールベースの権限制御
- **APIキー管理**: 外部統合向け

### データセキュリティ

- **暗号化（At Rest / In Transit）**: KMS + TLS
- **Secrets Manager**: 機密情報の集中管理
- **ネットワーク制御**: VPC / SG / NACL

### コンプライアンス・監査

- **CloudTrail + CloudWatch Logs**: 監査証跡
- **依存関係スキャン**: GitHub Actions + npm audit
- **インシデント対応**: アラート通知 + Runbook

---

## パフォーマンス & スケーラビリティ

### 水平方向スケーリング

- **Lambda Auto Scaling**: トラフィックに応じて自動拡張
- **CloudFront + S3**: 高速かつグローバル配信
- **DynamoDB オートスケーリング**: 書き込み/読み込みキャパシティ調整

### 最適化

- **コード分割 / 遅延ロード**: React/Vite によるパフォーマンス向上
- **画像最適化**: CloudFront Functions or 事前最適化
- **DB インデックス**: DynamoDB パーティション設計

### 監視

- **CloudWatch Metrics/Alarms**: 基盤監視
- **X-Ray**: 分散トレーシング
- **Sentry（導入検討）**: アプリケーションエラートラッキング

---

## 開発プラクティス

### コード品質

- **TypeScript strict**: 厳格な型チェック
- **ESLint/Prettier**: コード品質・統一
- **Jest**: 単体テスト
- **React Testing Library**: コンポーネントテスト

### CI/CD

- **GitHub Actions**: CI/CD パイプライン
  - `ci.yml`: lint/test/build
  - `deploy.yml`: CDK デプロイ
  - `quality.yml`: Gitleaks 等の品質チェック
- **ステージ分離**: dev/prod 別 AWS アカウント
- **ロールバック**: CDK diff & rollback 戦略

### ドキュメント

- **API**: OpenAPI (REST) + GraphQL Schema（検討）
- **コード**: JSDoc コメント
- **アーキテクチャ**: `docs/architecture/` に設計資料
- **Runbooks**: インシデント対応手順書

---

## 技術選定の理由

### TypeScript

- 型安全によりエラーを事前に防止
- IDE補完・リファクタリング効率向上
- モノレポ全体の一貫性

### AWS

- マルチサービスを一元的に提供
- セキュリティ・コンプライアンスが強力
- サーバレス基盤でコスト効率的

### モノレポ

- **pnpm + Turborepo** による一元的な依存管理
- コード共有と再利用の促進
- 一貫したCI/CDパイプライン

### React + Vite

- 軽量・高速ビルド
- SPA構成で S3 + CloudFront と相性が良い
- エコシステムが充実
