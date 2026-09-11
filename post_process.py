#!/usr/bin/env python3
"""Post-process report HTML files: inject navigation bar + enforce light theme.
Run automatically by publish.sh after scanning reports.
All reports are forced to light theme - no dark mode overrides."""

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
  background: rgba(246,248,250,0.92);
  border-bottom: 1px solid #d0d7de;
}
.site-nav a { text-decoration: none; font-weight: 500; color: #0969da; }
.site-nav a:hover { text-decoration: underline; }
.site-nav .nav-sep { color: #d0d7de; }
.site-nav .nav-current { color: #656d76; }
</style>"""

CATEGORY_MAP = {
    "semiconductor_daily": "半导体每日早报",
    "ai_server": "AI服务器分析报告",
    "market_sentiment": "A股市场情绪与题材复盘报告",
    "stock_picks": "次日必涨股票分析",
}

# Dark hex colors → light equivalents
COLOR_MAP = {
    '#0d1117': '#f6f8fa',
    '#161b22': '#ffffff',
    '#1c2128': '#f0f3f6',
    '#22272e': '#e6e8eb',
    '#30363d': '#d0d7de',
    '#0a0e17': '#f6f8fa',
    '#111722': '#ffffff',
    '#1e2a3a': '#d0d7de',
    '#e6edf3': '#1f2328',
    '#e4e9f0': '#1f2328',
    '#8b949e': '#656d76',
    '#6e7681': '#8b949e',
    '#8b95a7': '#656d76',
    '#5a6577': '#8b949e',
    '#1a2332': '#f0f3f6',
    '#0d1320': '#ffffff',
    '#162035': '#f0f3f6',
}

# Dark rgba prefixes → light equivalents
RGBA_MAP = {
    'rgba(248, 81, 73': 'rgba(207, 34, 46',
    'rgba(248,81,73': 'rgba(207, 34, 46',
    'rgba(63, 185, 80': 'rgba(26, 127, 55',
    'rgba(63,185,80': 'rgba(26, 127, 55',
    'rgba(88, 166, 255': 'rgba(9, 105, 218',
    'rgba(88,166,255': 'rgba(9, 105, 218',
    'rgba(210, 153, 34': 'rgba(154, 103, 0',
    'rgba(210,153,34': 'rgba(154, 103, 0',
    'rgba(188, 140, 255': 'rgba(130, 80, 223',
    'rgba(232, 135, 62': 'rgba(188, 76, 0',
    'rgba(255, 61, 87': 'rgba(207, 34, 46',
    'rgba(255,61,87': 'rgba(207, 34, 46',
    'rgba(0, 200, 83': 'rgba(26, 127, 55',
    'rgba(0,200,83': 'rgba(26, 127, 55',
    'rgba(74, 158, 255': 'rgba(9, 105, 218',
    'rgba(74,158,255': 'rgba(9, 105, 218',
    'rgba(0, 212, 255': 'rgba(9, 105, 218',
    'rgba(0,212,255': 'rgba(9, 105, 218',
    'rgba(255, 167, 38': 'rgba(154, 103, 0',
    'rgba(255,167,38': 'rgba(154, 103, 0',
    'rgba(255, 213, 79': 'rgba(154, 103, 0',
    'rgba(255,213,79': 'rgba(154, 103, 0',
    'rgba(13,17,23': 'rgba(246,248,250',
    'rgba(13, 17, 23': 'rgba(246,248,250',
}

# Gradient mappings
GRADIENT_MAP = {
    'linear-gradient(135deg, #1c2128 0%, #22272e 100%)': 'linear-gradient(135deg, #ffffff 0%, #f0f3f6 100%)',
    'linear-gradient(135deg, #0d1320 0%, #162035 100%)': 'linear-gradient(135deg, #ffffff 0%, #f0f3f6 100%)',
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


def remove_dark_media_blocks(content):
    """Remove @media (prefers-color-scheme: dark) { ... } blocks."""
    pattern = '@media (prefers-color-scheme: dark)'
    # Also match without spaces
    for pat in [pattern, '@media(prefers-color-scheme:dark)', '@media (prefers-color-scheme:dark)', '@media(prefers-color-scheme: dark)']:
        while pat in content:
            idx = content.find(pat)
            if idx == -1:
                break
            brace_start = content.find('{', idx)
            if brace_start == -1:
                break
            depth = 1
            pos = brace_start + 1
            while pos < len(content) and depth > 0:
                if content[pos] == '{':
                    depth += 1
                elif content[pos] == '}':
                    depth -= 1
                pos += 1
            if depth == 0:
                line_start = idx
                while line_start > 0 and content[line_start - 1] != '\n':
                    line_start -= 1
                content = content[:line_start] + content[pos:]
    return content


def enforce_light_theme(content):
    """Replace all dark colors with light equivalents and remove dark mode overrides."""
    # Remove dark media query blocks
    content = remove_dark_media_blocks(content)

    # Remove any !important dark background overrides
    content = re.sub(r'body\s*\{[^}]*background:\s*#0[0-9a-f]+[^}]*!important[^}]*\}', '', content, flags=re.I)
    content = re.sub(r'body\s*\{[^}]*background:\s*#1[0-9a-f]+[^}]*!important[^}]*\}', '', content, flags=re.I)

    # Replace dark hex colors
    for dark, light in COLOR_MAP.items():
        content = content.replace(dark, light)
        content = content.replace(dark.upper(), light)

    # Replace dark rgba prefixes
    for dark, light in RGBA_MAP.items():
        content = content.replace(dark, light)

    # Replace gradients
    for dark, light in GRADIENT_MAP.items():
        content = content.replace(dark, light)

    return content


def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content

    # Enforce light theme
    content = enforce_light_theme(content)

    # Inject nav bar if missing
    has_nav = "site-nav" in content
    if not has_nav:
        # Add nav CSS before </head>
        if "</head>" in content:
            content = content.replace("</head>", f"\n{NAV_CSS}\n</head>", 1)
        # Add nav HTML after <body>
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
        os.path.join(BASE, "market_sentiment", "*.html"),
        os.path.join(BASE, "stock_picks", "*.html"),
    ]

    total = 0
    for pattern in patterns:
        for filepath in sorted(glob.glob(pattern)):
            if process_file(filepath):
                print(f"  fixed: {os.path.relpath(filepath, BASE)}")
                total += 1
            else:
                print(f"  skip (already light + nav): {os.path.relpath(filepath, BASE)}")

    print(f"  Post-process complete: {total} file(s) updated")

if __name__ == "__main__":
    main()
