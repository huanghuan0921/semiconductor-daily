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
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-size: 14px;
}
.site-nav a { text-decoration: none; font-weight: 500; }
.site-nav a:hover { text-decoration: underline; }
@media (prefers-color-scheme: light) {
  .site-nav { background: rgba(246,248,250,0.92); border-bottom: 1px solid #d0d7de; }
  .site-nav a { color: #0969da; }
  .site-nav .nav-sep { color: #d0d7de; }
  .site-nav .nav-current { color: #656d76; }
}
@media (prefers-color-scheme: dark) {
  .site-nav { background: rgba(13,17,23,0.92); border-bottom: 1px solid #30363d; }
  .site-nav a { color: #58a6ff; }
  .site-nav .nav-sep { color: #30363d; }
  .site-nav .nav-current { color: #8b949e; }
}
</style>"""

GENERIC_LIGHT_MODE = """@media (prefers-color-scheme: light) {
  :root { color-scheme: light; }
  body { background: #f6f8fa !important; color: #1f2328 !important; }
  .header { background: linear-gradient(135deg, #ffffff 0%, #eaeef2 100%) !important; }
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
    relpath = os.path.relpath(filepath, BASE)
    parts = relpath.split(os.sep)
    if len(parts) == 1:
        home_link = "index.html"
        label = "半导体每日早报"
    else:
        subdir = parts[0]
        home_link = "../index.html"
        label = CATEGORY_MAP.get(subdir, subdir)
    return f'<nav class="site-nav">\n  <a href="{home_link}">← 半导体投研信息中心</a>\n  <span class="nav-sep">/</span>\n  <span class="nav-current">{label}</span>\n</nav>'

def is_dark_themed(content):
    """Detect if file uses dark background by default."""
    dark_patterns = [
        r'--bg[^:]*:\s*#0[0-9a-f]',
        r'--bg[^:]*:\s*#1[0-9a-f]',
        r'background:\s*#0[0-9a-f]',
        r'background:\s*#1[0-9a-f]',
    ]
    for pattern in dark_patterns:
        if re.search(pattern, content, re.I):
            return True
    return False

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    has_nav = "site-nav" in content
    has_light = "prefers-color-scheme: light" in content
    has_dark = "prefers-color-scheme: dark" in content

    if has_nav and has_light and has_dark:
        return False

    dark_bg = is_dark_themed(content)

    css_parts = []
    if not has_nav:
        css_parts.append(NAV_CSS)
    if dark_bg and not has_light:
        css_parts.append(f"<style>\n{GENERIC_LIGHT_MODE}\n</style>")
    if not dark_bg and not has_dark:
        css_parts.append(f"<style>\n{GENERIC_DARK_MODE}\n</style>")

    if css_parts:
        style_block = "\n" + "\n".join(css_parts) + "\n"
        content = content.replace("</head>", f"{style_block}</head>", 1)

    if not has_nav:
        nav_html = get_nav_html(filepath)
        body_match = re.search(r'<body[^>]*>', content)
        if body_match:
            insert_pos = body_match.end()
            content = content[:insert_pos] + "\n" + nav_html + content[insert_pos:]

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False

def main():
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
                print(f"  skip (already complete): {os.path.relpath(filepath, BASE)}")

    print(f"  Post-process complete: {total} file(s) updated")

if __name__ == "__main__":
    main()
