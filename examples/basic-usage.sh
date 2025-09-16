#!/bin/bash

# ZetaChain MCP CLI Basic Usage Examples
# This script demonstrates basic usage of the zetachain-mcp-cli

echo "🔧 ZetaChain MCP CLI - Basic Usage Examples"
echo "=========================================="

# Start the server (assumes it's running on port 7001)
SERVER_URL="http://localhost:7001"

echo ""
echo "1. Health Check"
echo "---------------"
curl -s $SERVER_URL/health | jq '.' 2>/dev/null || curl -s $SERVER_URL/health

echo ""
echo ""
echo "2. ZetaChain Version"
echo "-------------------"
curl -s "$SERVER_URL/zetachain?cmd=version" | jq '.' 2>/dev/null || curl -s "$SERVER_URL/zetachain?cmd=version"

echo ""
echo ""
echo "3. ZetaChain Help"
echo "----------------"
curl -s "$SERVER_URL/zetachain?cmd=help" | jq '.' 2>/dev/null || curl -s "$SERVER_URL/zetachain?cmd=help"

echo ""
echo ""
echo "4. Contract Discovery"
echo "--------------------"
curl -s $SERVER_URL/contracts | jq '.' 2>/dev/null || curl -s $SERVER_URL/contracts

echo ""
echo ""
echo "5. Project Information"
echo "---------------------"
curl -s $SERVER_URL/project-info | jq '.' 2>/dev/null || curl -s $SERVER_URL/project-info

echo ""
echo ""
echo "6. Prerequisites Check"
echo "---------------------"
curl -s $SERVER_URL/prerequisites | jq '.' 2>/dev/null || curl -s $SERVER_URL/prerequisites

echo ""
echo ""
echo "7. Localnet Status"
echo "-----------------"
curl -s "$SERVER_URL/zetachain?cmd=localnet%20status" | jq '.' 2>/dev/null || curl -s "$SERVER_URL/zetachain?cmd=localnet%20status"

echo ""
echo ""
echo "✅ Basic usage examples completed!"
echo ""
echo "💡 Tips:"
echo "   - Install jq for better JSON formatting: brew install jq"
echo "   - Use the start-server.sh script to manage the server"
echo "   - Check logs at ~/.claude/logs/zetachain-mcp-cli.log"
