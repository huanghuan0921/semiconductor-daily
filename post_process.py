#!/usr/bin/env python3
"""Post-process report HTML files: inject navigation bar + light/dark mode support.
Run automatically by publish.sh after scanning reports."""

import os
import re
import glob

BASE = os.path.dirname(os.path.abspath(__file__))

NAV_CSS = """<style>
.site-nav {
  position: sticky; top: 0; z-index: 9999;
  display: flex; align-items: center; gap: 12px;
  padding: 10px 20px;
  background: rgba(13,17,23,0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid #30363d;
  font-size: 14px;
}
.site-nav a {
  color: #58a6ff; text-decoration: none; font-weight: 500;
  display: flex; align-items: center; gap: 6px;
}
.site-nav a:hover { text-decoration: underline; }
.site-nav .nav-sep { color: #30363d; }
.site-nav .nav-current { color: #8b949e; }
@media (prefers-color-scheme: light) {
  .site-nav {
    background: rgba(246,248,250,0.92);
    border-bottom-color: #d0d7de;
  }
  .site-nav a { color: #0969da; }
  .site-nav .nav-sep { color: #d0d7de; }
  .site-nav .nav-current { color: #656d76; }
}
</style>"""

GENERIC_LIGHT_MODE = """@media (prefers-color-scheme: light) {
  :root { color-scheme: light; }
  body { background: #f6f8fa !important; color: #1f2328 !important; }
}"""

GENERIC_DARK_MODE = """@media (prefers-color-scheme: dark) {
  :root { color-scheme: dark; }
  body { background: #0d1117 !important; color: #e6edf3 !important; }
}"""

CATEGORY_MAP = {
    "semiconductor_daily": "半导体每日早报",
    "ai_server": "AI服务器分析报告",
    "stock_picks": "次日必涨股票分析",
}

def get_nav_html(filepath):
    """Build nav bar HTML based on file location."""
    relpath = os.path.relpath(filepath, BASE)
    parts = relpath.split(os.sep)

    if len(parts) == 1:
        # Root directory file (e.g., semiconductor_daily_20260818.html)
        home_link = "index.html"
        label = "半导体每日早报"
    else:
        # Subdirectory file (e.g., ai_server/xxx.html)
        subdir = parts[0]
        home_link = "../index.html"
        label = CATEGORY_MAP.get(subdir, subdir)

    return f'<nav class="site-nav">\n  <a href="{home_link}">← 半导体投研信息中心</a>\n  <span class="nav-sep">/</span>\n  <span class="nav-current">{label}</span>\n</nav>'

def process_file(filepath):
    """Inject nav bar + light mode if missing."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    changed = False

    # 1. Inject nav CSS + light/dark mode CSS before </head>
    if "site-nav" not in content:
        # Determine if file is dark or light themed
        has_dark_bg = bool(re.search(r'--bg[^:]*:\s*#0[0-9a-f]', content, re.I))
        has_light_bg = bool(re.search(r'--bg[^:]*:\s*#f[0-9a-f]', content, re.I))

        mode_css = GENERIC_LIGHT_MODE if has_dark_bg else GENERIC_DARK_MODE
        style_block = f"\n{NAV_CSS}\n<style>\n{mode_css}\n</style>\n"
        content = content.replace("</head>", f"{style_block}</head>", 1)
        changed = True

    # 2. Inject nav bar after <body> tag
    if "site-nav" not in content or (changed and "site-nav" not in original):
        nav_html = get_nav_html(filepath)
        body_match = re.search(r'<body[^>]*>', content)
        if body_match:
            insert_pos = body_match.end()
            content = content[:insert_pos] + "\n" + nav_html + content[insert_pos:]
            changed = True

    if changed and content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False

def main():
    # Find all HTML files
    patterns = [
        os.path.join(BASE, "semiconductor_daily_*.html"),
        os.path.join(BASE, "ai_server", "*.html"),
        os.path.join(BASE, "stock_picks", "*.html"),
    ]

    total = 0
    for pattern in patterns:
        for filepath in sorted(glob.glob(pattern)):
            if process_file(filepath):
                print(f"  injected: {os.path.relpath(filepath, BASE)}")
                total += 1
            else:
                print(f"  skip (already has nav): {os.path.relpath(filepath, BASE)}")

    print(f"  Post-process complete: {total} file(s) updated")

if __name__ == "__main__":
    main()
