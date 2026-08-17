#!/bin/bash
set -e

WORK_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$WORK_DIR"

GITHUB_USER="huanghuan0921"
REPO_NAME="semiconductor-daily"
SITE_URL="https://huanghuan0921.github.io/semiconductor-daily/"

echo "=== 半导体早报发布脚本 ==="

# 1. 扫描所有报告文件，更新 manifest.json（按日期降序）
echo "[1/3] 更新报告清单..."
REPORTS=()
for f in semiconductor_daily_*.html; do
  [ -e "$f" ] || continue
  date_str=$(echo "$f" | sed 's/semiconductor_daily_\([0-9]*\)\.html/\1/')
  if [ ${#date_str} -eq 8 ]; then
    formatted="${date_str:0:4}-${date_str:4:2}-${date_str:6:2}"
    REPORTS+=("$date_str|{\"date\":\"$formatted\",\"file\":\"$f\"}")
  fi
done

if [ ${#REPORTS[@]} -eq 0 ]; then
  echo "  未找到报告文件，manifest 保持为空"
  echo '{"reports":[]}' > manifest.json
else
  IFS=$'\n' SORTED=($(printf '%s\n' "${REPORTS[@]}" | sort -r))
  unset IFS
  JSON_PARTS=""
  for entry in "${SORTED[@]}"; do
    json=$(echo "$entry" | cut -d'|' -f2)
    if [ -z "$JSON_PARTS" ]; then
      JSON_PARTS="$json"
    else
      JSON_PARTS="$JSON_PARTS,$json"
    fi
  done
  echo "{\"reports\":[$JSON_PARTS]}" > manifest.json
  echo "  已更新 manifest.json，共 ${#REPORTS[@]} 篇报告"
fi

# 2. Git 提交
echo "[2/3] Git 提交..."
git add -A
if git diff --cached --quiet; then
  echo "  无变更，跳过提交"
else
  git commit -m "Update: $(date '+%Y-%m-%d %H:%M') 半导体早报自动发布"
  echo "  已提交变更"
fi

# 3. Git 推送（从 .github_token 读取令牌认证）
echo "[3/3] Git 推送..."
if [ ! -f .github_token ]; then
  echo "  错误: 未找到 .github_token 文件，无法推送"
  echo "  请创建 GitHub Personal Access Token 并保存到 .github_token"
  exit 1
fi

TOKEN=$(cat .github_token)
PUSH_URL="https://${GITHUB_USER}:${TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

git push "$PUSH_URL" main 2>&1 | sed "s|$TOKEN|***|g"
echo "  推送完成"
echo ""
echo "=== 发布完成 ==="
echo "网站地址: $SITE_URL"
