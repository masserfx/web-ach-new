#!/usr/bin/env python3
"""
Debug CSS layout for products page
Uses Chrome DevTools Protocol to inspect computed styles
"""

import json
import requests
import time

# Chrome is running with --remote-debugging-port=9222
CHROME_DEBUG_URL = "http://localhost:9222"

def get_tabs():
    """Get list of open tabs"""
    response = requests.get(f"{CHROME_DEBUG_URL}/json")
    return response.json()

def navigate_to_products():
    """Navigate to products page"""
    print("🔍 Navigating to products page...")

    # Get active tab
    tabs = get_tabs()
    if not tabs:
        print("❌ No Chrome tabs found")
        return None

    # Use first tab
    tab = tabs[0]
    ws_url = tab['webSocketDebuggerUrl']

    print(f"✅ Found tab: {tab.get('title', 'Untitled')}")
    print(f"   URL: {tab.get('url', 'about:blank')}")
    print(f"   WebSocket: {ws_url}")

    return tab

def main():
    print("=" * 60)
    print("🐛 AC Heating Web - Layout Debugger")
    print("=" * 60)

    tab = navigate_to_products()

    if not tab:
        print("\n❌ Failed to connect to Chrome")
        print("   Make sure Chrome is running with remote debugging")
        return

    print("\n📋 Next steps:")
    print("1. Open Chrome DevTools manually")
    print("2. Navigate to: http://91.99.126.53:3100/produkty")
    print("3. Inspect grid element with class 'grid grid-cols-1'")
    print("4. Check computed styles for:")
    print("   - display: grid")
    print("   - grid-template-columns")
    print("   - width/max-width")
    print("   - parent container width")

    print("\n🔍 Check these elements:")
    print("   1. div.space-y-16.w-full (parent)")
    print("   2. div.w-full (category wrapper)")
    print("   3. div.grid.grid-cols-1... (products grid)")

    print("\n💡 Common issues:")
    print("   - Parent with fixed width")
    print("   - max-width on wrapper")
    print("   - flex container not allowing grid expansion")

if __name__ == "__main__":
    main()
