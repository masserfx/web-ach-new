#!/bin/bash

# Browser MCP Connection Monitor for Mac
# Usage: ./browser-mcp-monitor.sh
# Ctrl+C to exit

echo "🔍 Browser MCP Connection Monitor (Mac)"
echo "========================================"
echo ""
echo "Monitoring connection to 91.99.126.53:8765"
echo "Press Ctrl+C to exit"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_connection() {
    local timestamp=$(date '+%H:%M:%S')

    # Test 1: nc connection
    local nc_result=$(timeout 2 nc -zv 91.99.126.53 8765 2>&1)
    local nc_status=$?

    # Test 2: curl WebSocket handshake
    local curl_result=$(timeout 3 curl -i -N \
        -H "Connection: Upgrade" \
        -H "Upgrade: websocket" \
        -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
        -H "Sec-WebSocket-Version: 13" \
        http://91.99.126.53:8765/ 2>&1 | head -1)

    # Test 3: Check if HTTP API responds (fallback)
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" -m 2 http://91.99.126.53:3005/api/status)

    # Display results
    echo "[$timestamp]"

    # NC Test
    if [ $nc_status -eq 0 ]; then
        echo -e "${GREEN}✅ Port 8765 reachable${NC} - TCP connection OK"
    else
        echo -e "${RED}❌ Port 8765 unreachable${NC} - May need SSH tunnel"
    fi

    # Curl Test
    if [[ $curl_result == *"101"* ]] || [[ $curl_result == *"Switching"* ]]; then
        echo -e "${GREEN}✅ WebSocket upgrade works${NC} - Server is responding correctly"
    elif [[ $curl_result == *"404"* ]] || [[ $curl_result == *"500"* ]]; then
        echo -e "${RED}❌ Server error ($curl_result)${NC} - May need daemon restart"
    else
        echo -e "${YELLOW}⏱️  WebSocket timeout${NC} - Check firewall settings"
    fi

    # HTTP Test (fallback)
    if [ "$http_status" == "200" ] || [ "$http_status" == "401" ]; then
        echo -e "${GREEN}✅ HTTP API (port 3005) works${NC} - Server is alive"
    else
        echo -e "${RED}❌ HTTP API failed (status: $http_status)${NC}"
    fi

    echo "---"
}

# Run initial test
test_connection

# Continuous monitoring
while true; do
    sleep 5
    test_connection
done
