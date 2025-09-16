#!/bin/bash

# ZetaChain MCP Server Installer for Claude Code/Desktop

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if we're in the right directory
if [ ! -f "server.js" ] || [ ! -f "package.json" ]; then
    print_error "Run this script from the zetachain-mcp-server directory"
    exit 1
fi

echo "🚀 ZetaChain MCP Server Installer"
echo "=================================="

# Get user's ZetaChain project path
echo "Enter your ZetaChain project path:"
echo "Examples: /Users/yourname/Projects/my-zetachain-project"
read -p "Project Path: " ZETA_PROJECT_PATH

# Validate path
if [ ! -d "$ZETA_PROJECT_PATH" ]; then
    print_warning "Directory '$ZETA_PROJECT_PATH' does not exist"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Installation cancelled"
        exit 1
    fi
fi

# Create Claude MCP directory
CLAUDE_MCP_DIR="$HOME/.claude/mcp/zetachain"
print_status "Creating directory: $CLAUDE_MCP_DIR"
mkdir -p "$CLAUDE_MCP_DIR"

# Copy files
print_status "Copying files..."
cp -r * "$CLAUDE_MCP_DIR/"

# Install dependencies
print_status "Installing dependencies..."
cd "$CLAUDE_MCP_DIR"
npm install --production

# Create configuration
print_status "Creating configuration..."
cat > claude.server.json << EOF
{
  "name": "ZetaChain Toolkit",
  "description": "Inspect ZetaChain project structure, contracts, and execute ZetaChain CLI commands",
  "command": "node",
  "args": ["server.js"],
  "port": 7000,
  "id": "mcp-zetachain",
  "version": "1.0.0",
  "env": {
    "ZETA_PROJECT_PATH": "$ZETA_PROJECT_PATH",
    "MCP_PORT": "7000"
  }
}
EOF

# Test server
print_status "Testing server..."
if command -v node >/dev/null 2>&1; then
    ZETA_PROJECT_PATH="$ZETA_PROJECT_PATH" MCP_PORT=7000 node server.js &
    SERVER_PID=$!
    sleep 3
    
    if curl -s http://localhost:7000/health >/dev/null 2>&1; then
        print_status "✅ Server test passed"
    else
        print_warning "⚠️ Server test failed"
    fi
    
    kill $SERVER_PID 2>/dev/null || true
fi

echo
print_status "🎉 Installation complete!"
echo
echo "Next steps:"
echo "1. Restart Claude Code/Desktop"
echo "2. Ask Claude: 'Show me contracts in my ZetaChain project'"
echo
echo "Location: $CLAUDE_MCP_DIR"
echo "Config: $CLAUDE_MCP_DIR/claude.server.json"
echo

# Install prerequisites
read -p "Install prerequisites (Foundry, ZetaChain CLI)? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "$CLAUDE_MCP_DIR/scripts/install-prerequisites.sh" ]; then
        chmod +x "$CLAUDE_MCP_DIR/scripts/install-prerequisites.sh"
        "$CLAUDE_MCP_DIR/scripts/install-prerequisites.sh"
    fi
fi

print_status "🚀 Ready! Restart Claude to use ZetaChain MCP server!"