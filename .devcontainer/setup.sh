#!/bin/bash
set -euo pipefail

# --- Corepack + pnpm を非対話で用意 ---
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0    # 抑制フラグ（効かない環境の保険で次行を用意）
corepack enable || true

# ダウンロード確認が出る環境の保険：強制 Y
yes | corepack prepare pnpm@10.16.0 --activate || true

# 以後の pnpm は Corepack 経由
pnpm -v

export PNPM_HOME=/home/vscode/.local/share/pnpm
mkdir -p $PNPM_HOME
echo 'export PNPM_HOME=/home/vscode/.local/share/pnpm' >> /home/vscode/.bashrc
echo 'export PATH=$PNPM_HOME:$PATH' >> /home/vscode/.bashrc
export PATH=$PNPM_HOME:$PATH
# pnpm add -g turbo@latest --prefer-fresh
pnpm install

# 最新バージョンを設定（必要に応じて変更可）
GITLEAKS_VERSION="8.18.1"

# ダウンロードして展開
curl -sSL -o /tmp/gitleaks.tar.gz https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz
tar -xzf /tmp/gitleaks.tar.gz -C /tmp

# 実行権限を付与して配置
chmod +x /tmp/gitleaks
sudo mv /tmp/gitleaks /usr/local/bin/gitleaks

