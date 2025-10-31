#!/bin/bash

# Browser MCP Remote Server Diagnostics
# Spusť na remote serveru: bash ~/ac-heating-web-new/BROWSER_MCP_REMOTE_DIAGNOSTICS.sh

echo "=========================================="
echo "Browser MCP Remote Diagnostics"
echo "=========================================="
echo ""

# 1. WebSocket Daemon Status
echo "1️⃣  WebSocket Daemon Status"
echo "---"
lsof -i :8765 | head -5
echo ""

# 2. WebSocket Process Details
echo "2️⃣  WebSocket Process Details"
echo "---"
ps aux | grep -i browsermcp | grep -v grep
echo ""

# 3. Recent logs from daemon
echo "3️⃣  Recent Browser MCP Logs"
echo "---"
if [ -f /tmp/browsermcp-daemon.log ]; then
    echo "From /tmp/browsermcp-daemon.log (last 30 lines):"
    tail -30 /tmp/browsermcp-daemon.log
else
    echo "No /tmp/browsermcp-daemon.log found"
fi
echo ""

if [ -f /tmp/browsermcp-remote.log ]; then
    echo "From /tmp/browsermcp-remote.log (last 30 lines):"
    tail -30 /tmp/browsermcp-remote.log
else
    echo "No /tmp/browsermcp-remote.log found"
fi
echo ""

# 4. Systemd logs (if running as service)
echo "4️⃣  Systemd Service Logs"
echo "---"
systemctl --user status browsermcp-daemon.service 2>/dev/null || systemctl status browsermcp-daemon 2>/dev/null || echo "No systemd service found"
echo ""

# 5. Network socket statistics
echo "5️⃣  Network Socket Statistics"
echo "---"
netstat -an | grep 8765
echo ""

# 6. Check if WebSocket is accepting connections
echo "6️⃣  WebSocket Connection Test"
echo "---"
echo "Testing local WebSocket connection..."
timeout 3 curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://localhost:8765 2>&1 | head -20 || echo "Connection test completed or timed out (expected)"
echo ""

# 7. Check for recent connection attempts in syslog
echo "7️⃣  Recent Connection Attempts"
echo "---"
echo "Checking system logs for port 8765 activity..."
journalctl -n 50 2>/dev/null | grep -i 8765 || grep -i 8765 /var/log/syslog 2>/dev/null | tail -10 || echo "No specific logs found"
echo ""

# 8. WebSocket daemon startup command
echo "8️⃣  WebSocket Daemon Startup Info"
echo "---"
if [ -f ~/.local/lib/browsermcp-enhanced/package.json ]; then
    echo "Browser MCP Enhanced location: ~/.local/lib/browsermcp-enhanced/"
    cd ~/.local/lib/browsermcp-enhanced
    echo "Start script from package.json:"
    grep -A 5 '"scripts"' package.json | head -10
else
    echo "Browser MCP Enhanced not found at ~/.local/lib/browsermcp-enhanced/"
fi
echo ""

# 9. Port and process details
echo "9️⃣  Detailed Port 8765 Info"
echo "---"
echo "Full process info:"
lsof -i :8765 -a -p $(lsof -t -i :8765) 2>/dev/null || lsof -i :8765
echo ""

# 10. Memory and system status
echo "🔟 System Status"
echo "---"
echo "Memory:"
free -h
echo ""
echo "Load Average:"
uptime
echo ""

# 11. Firewall rules
echo "1️⃣1️⃣  Firewall Rules"
echo "---"
echo "Checking UFW status..."
sudo ufw status 2>/dev/null | grep 8765 || echo "UFW not active or 8765 not restricted"
echo ""
echo "Checking iptables..."
sudo iptables -L -n 2>/dev/null | grep 8765 || echo "No iptables rules for 8765"
echo ""

# 12. Configuration files
echo "1️⃣2️⃣  Configuration Files"
echo "---"
if [ -f ~/.browsermcp-remote.config.json ]; then
    echo "Found ~/.browsermcp-remote.config.json"
    echo "WebSocket port setting:"
    grep -i websocketport ~/.browsermcp-remote.config.json
else
    echo "No ~/.browsermcp-remote.config.json found"
fi
echo ""

if [ -f ~/ac-heating-web-new/.browsermcp-remote.config.json ]; then
    echo "Found ~/ac-heating-web-new/.browsermcp-remote.config.json"
    echo "WebSocket port setting:"
    grep -i websocketport ~/ac-heating-web-new/.browsermcp-remote.config.json
else
    echo "No ~/ac-heating-web-new/.browsermcp-remote.config.json found"
fi
echo ""

echo "=========================================="
echo "Diagnostics Complete"
echo "=========================================="
echo ""
echo "📋 Summary for troubleshooting:"
echo "- If daemon not running: restart it"
echo "- If listening: check firewall"
echo "- If firewall OK: check CORS headers"
echo "- Check extension manifest: host_permissions"
echo ""
