#!/bin/bash
set -e

WORK_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$WORK_DIR"

echo "=== 半导体早报发布脚本 ==="

# 1. 扫描所有报告文件，更新 manifest.json
echo "[1/3] 更新报告清单..."
REPORTS=()
for f in semiconductor_daily_*.html; do
  [ -e "$f" ] || continue
  date_str=$(echo "$f" | sed 's/semiconductor_daily_\([0-9]*\)\.html/\1/')
  if [ ${#date_str} -eq 8 ]; then
    formatted="${date_str:0:4}-${date_str:4:2}-${date_str:6:2}"
    REPORTS+=("{\"date\":\"$formatted\",\"file\":\"$f\"}")
  fi
done

if [ ${#REPORTS[@]} -eq 0 ]; then
  echo "  未找到报告文件，manifest 保持为空"
  echo '{"reports":[]}' > manifest.json
else
  IFS=,
  joined="${REPORTS[*]}"
  echo "{\"reports\":[$joined]}" > manifest.json
  echo "  已更新 manifest.json，共 ${#REPORTS[@]} 篇报告"
fi
unset IFS

# 2. Git 提交
echo "[2/3] Git 提交..."
git add -A
if git diff --cached --quiet; then
  echo "  无变更，跳过提交"
else
  git commit -m "Update: $(date '+%Y-%m-%d %H:%M') 半导体早报自动发布"
  echo "  已提交变更"
fi

# 3. Git 推送
echo "[3/3] Git 推送..."
if git remote get-url origin >/dev/null 2>&1; then
  git push origin HEAD:main 2>/dev/null || git push origin HEAD:master 2>/dev/null || git push origin main 2>/dev/null || git push origin master 2>/dev/null
  echo "  推送完成"
  echo ""
  echo "=== 发布完成 ==="
  REMOTE_URL=$(git remote get-url origin 2>/dev/null | sed 's/.*github.com[:/]\([^/]*\)\/\([^/]*\)\.git/\1.github.io\/\2/' | sed 's/.*github.com[:/]\([^/]*\)\/\([^/]*\)/\1.github.io\/\2/')
  echo "网站地址: https://$REMOTE_URL"
else
  echo "  未配置远程仓库，请先运行:"
  echo "  git remote add origin git@github.com:<用户名>/<仓库名>.git"
  echo ""
  echo "=== 本地提交完成，等待配置远程仓库后推送 ==="
fi
