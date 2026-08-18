#!/bin/bash
set -e

WORK_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$WORK_DIR"

GITHUB_USER="huanghuan0921"
REPO_NAME="semiconductor-daily"
SITE_URL="https://huanghuan0921.github.io/semiconductor-daily/"

echo "=== 半导体投研信息中心 发布脚本 ==="

# --- Category 1: 半导体每日早报 ---
echo "[1/5] 扫描半导体每日早报..."
DAILY_REPORTS=()
for f in semiconductor_daily_*.html; do
  [ -e "$f" ] || continue
  date_str=$(echo "$f" | sed 's/semiconductor_daily_\([0-9]*\)\.html/\1/')
  if [ ${#date_str} -eq 8 ]; then
    formatted="${date_str:0:4}-${date_str:4:2}-${date_str:6:2}"
    DAILY_REPORTS+=("$date_str|{\"date\":\"$formatted\",\"file\":\"$f\",\"subtitle\":\"点击查看完整早报\"}")
  fi
done

DAILY_JSON=""
if [ ${#DAILY_REPORTS[@]} -gt 0 ]; then
  IFS=$'\n' DAILY_SORTED=($(printf '%s\n' "${DAILY_REPORTS[@]}" | sort -r))
  unset IFS
  for entry in "${DAILY_SORTED[@]}"; do
    json=$(echo "$entry" | cut -d'|' -f2)
    if [ -z "$DAILY_JSON" ]; then
      DAILY_JSON="$json"
    else
      DAILY_JSON="$DAILY_JSON,$json"
    fi
  done
  echo "  早报: ${#DAILY_SORTED[@]} 篇"
else
  echo "  早报: 0 篇"
fi

# --- Category 2: AI服务器分析报告 ---
echo "[2/5] 扫描AI服务器分析报告..."
AI_REPORTS=()
for f in ai_server/*.html; do
  [ -e "$f" ] || continue
  title=$(grep -o '<title>[^<]*</title>' "$f" | head -1 | sed 's/<title>\([^<]*\)<\/title>/\1/')
  title="${title//|/ - }"
  if [ -z "$title" ]; then
    title=$(basename "$f" .html | tr '_' ' ')
  fi
  file_date=$(date -r "$f" '+%Y-%m-%d' 2>/dev/null || echo "")
  AI_REPORTS+=("$file_date|{\"date\":\"$file_date\",\"title\":\"$title\",\"file\":\"$f\",\"subtitle\":\"点击查看完整报告\"}")
done

AI_JSON=""
if [ ${#AI_REPORTS[@]} -gt 0 ]; then
  IFS=$'\n' AI_SORTED=($(printf '%s\n' "${AI_REPORTS[@]}" | sort -r))
  unset IFS
  for entry in "${AI_SORTED[@]}"; do
    json=$(echo "$entry" | cut -d'|' -f2)
    if [ -z "$AI_JSON" ]; then
      AI_JSON="$json"
    else
      AI_JSON="$AI_JSON,$json"
    fi
  done
  echo "  AI服务器报告: ${#AI_SORTED[@]} 篇"
else
  echo "  AI服务器报告: 0 篇"
fi

# --- Category 3: 次日必涨股票分析 ---
echo "[3/5] 扫描次日必涨股票分析..."
STOCK_REPORTS=()
for f in stock_picks/*.html; do
  [ -e "$f" ] || continue
  title=$(grep -o '<title>[^<]*</title>' "$f" | head -1 | sed 's/<title>\([^<]*\)<\/title>/\1/')
  title="${title//|/ - }"
  if [ -z "$title" ]; then
    title=$(basename "$f" .html | tr '_' ' ')
  fi
  # Extract date from filename: YYYY-MM-DD-stock-picks.html
  fname=$(basename "$f")
  file_date=$(echo "$fname" | grep -o '^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}' || echo "")
  if [ -z "$file_date" ]; then
    file_date=$(date -r "$f" '+%Y-%m-%d' 2>/dev/null || echo "")
  fi
  STOCK_REPORTS+=("$file_date|{\"date\":\"$file_date\",\"title\":\"$title\",\"file\":\"$f\",\"subtitle\":\"点击查看完整选股分析\"}")
done

STOCK_JSON=""
if [ ${#STOCK_REPORTS[@]} -gt 0 ]; then
  IFS=$'\n' STOCK_SORTED=($(printf '%s\n' "${STOCK_REPORTS[@]}" | sort -r))
  unset IFS
  for entry in "${STOCK_SORTED[@]}"; do
    json=$(echo "$entry" | cut -d'|' -f2)
    if [ -z "$STOCK_JSON" ]; then
      STOCK_JSON="$json"
    else
      STOCK_JSON="$STOCK_JSON,$json"
    fi
  done
  echo "  选股分析: ${#STOCK_SORTED[@]} 篇"
else
  echo "  选股分析: 0 篇"
fi

# --- Build manifest.json ---
echo "[4/5] 生成 manifest.json..."

DAILY_CAT='{"id":"semiconductor_daily","name":"半导体每日早报","icon":"📡","description":"覆盖全球半导体产业重磅资讯 + 宏观金融传导分析 + A股半导体选股逻辑","reports":['"$DAILY_JSON"']}'
AI_CAT='{"id":"ai_server","name":"AI服务器分析报告","icon":"🖥️","description":"AI服务器产业链深度分析与前瞻研究","reports":['"$AI_JSON"']}'
STOCK_CAT='{"id":"stock_picks","name":"次日必涨股票分析","icon":"📈","description":"多维选股分析：缠论+520+游资+情绪共振，筛选次日高概率标的","reports":['"$STOCK_JSON"']}'

echo '{"categories":['"$DAILY_CAT"','"$AI_CAT"','"$STOCK_CAT"']}' > manifest.json
echo "  manifest.json 已更新"

# --- Git commit & push ---
echo "[5/5] Git 提交与推送..."
git add -A
if git diff --cached --quiet; then
  echo "  无变更，跳过提交"
else
  git commit -m "Update: $(date '+%Y-%m-%d %H:%M') 投研信息中心更新"
  echo "  已提交变更"
fi

if [ ! -f .github_token ]; then
  echo "  错误: 未找到 .github_token 文件，无法推送"
  exit 1
fi

TOKEN=$(cat .github_token)
PUSH_URL="https://${GITHUB_USER}:${TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

git push "$PUSH_URL" main 2>&1 | sed "s|$TOKEN|***|g"
echo "  推送完成"
echo ""
echo "=== 发布完成 ==="
echo "网站地址: $SITE_URL"
