# 🔧 ZetaChain MCP CLI

> **Simple ZetaChain CLI wrapper for Claude Code - Get started with ZetaChain in 5 minutes!**

[![npm version](https://badge.fury.io/js/zetachain-mcp-cli.svg)](https://badge.fury.io/js/zetachain-mcp-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

A beginner-friendly Model Context Protocol (MCP) server that provides Claude Code integration with ZetaChain development tools. Perfect for learning, prototyping, and quick ZetaChain CLI interactions.

## ✨ Features

- 🚀 **5-minute setup** - Single file, minimal dependencies
- 📚 **Beginner-friendly** - Perfect for learning ZetaChain
- 🔧 **Claude Code integration** - Seamless MCP protocol support
- 🌐 **Auto localnet management** - Automatic ZetaChain localnet setup
- 📋 **Contract discovery** - Find and inspect smart contracts
- ⚡ **CLI command execution** - Direct ZetaChain CLI access
- 🛠️ **Project analysis** - ZetaChain project structure inspection

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zetachain-mcp-cli.git
cd zetachain-mcp-cli

# Install dependencies
npm install

# Start the server
npm start
```

Or run directly:

```bash
# Start with custom port
MCP_PORT=7001 node server.js
```

### Using the Start Script

```bash
# Make executable (first time only)
chmod +x start-server.sh

# Start server with automatic management
./start-server.sh
```

## 📖 Usage

Once running, the server exposes these endpoints:

### Health Check
```bash
curl http://localhost:7001/health
```

### Contract Discovery
```bash
curl http://localhost:7001/contracts
```

### ZetaChain CLI Commands
```bash
curl "http://localhost:7001/zetachain?cmd=help"
curl "http://localhost:7001/zetachain?cmd=version"
```

### Project Information
```bash
curl http://localhost:7001/project-info
```

### Prerequisites Check
```bash
curl http://localhost:7001/prerequisites
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_PORT` | `7001` | Server port |
| `ZETA_PROJECT_PATH` | `~/Projects/zetachain` | ZetaChain project directory |

### Example Configuration

```bash
# Custom configuration
export MCP_PORT=8000
export ZETA_PROJECT_PATH="/custom/path/to/zetachain"
node server.js
```

## 📁 Project Structure

```
zetachain-mcp-cli/
├── server.js              # Main server file
├── start-server.sh         # Server management script
├── package.json            # Dependencies and metadata
├── README.md              # This file
└── scripts/
    └── install-prerequisites.sh  # Setup script
```

## 🛠️ Development

### Running in Development Mode

```bash
# With file watching
npm install -g nodemon
nodemon server.js
```

### Testing Endpoints

```bash
# Test all endpoints
curl http://localhost:7001/health
curl http://localhost:7001/contracts
curl "http://localhost:7001/zetachain?cmd=localnet status"
```

## 📚 Learning ZetaChain

This tool is perfect for learning ZetaChain development:

### 1. **Start with Basics**
```bash
# Check ZetaChain CLI is working
curl "http://localhost:7001/zetachain?cmd=version"

# Get help
curl "http://localhost:7001/zetachain?cmd=help"
```

### 2. **Explore Localnet**
```bash
# Check localnet status
curl "http://localhost:7001/zetachain?cmd=localnet status"

# Start localnet (if not running)
curl "http://localhost:7001/zetachain?cmd=localnet start"
```

### 3. **Contract Development**
```bash
# Discover contracts in your project
curl http://localhost:7001/contracts

# Analyze project structure
curl http://localhost:7001/project-info
```

## 🌐 Claude Code Integration

### Adding to Claude Code

1. **Install the server** following the steps above
2. **Start the server** with `./start-server.sh`
3. **Add to Claude Code settings**:

```json
{
  "mcpServers": {
    "zetachain-cli": {
      "command": "node",
      "args": ["/path/to/zetachain-mcp-cli/server.js"],
      "env": {
        "MCP_PORT": "7001"
      }
    }
  }
}
```

4. **Restart Claude Code** and start asking ZetaChain questions!

### Example Claude Prompts

- *"Show me the ZetaChain version"*
- *"Check if ZetaChain localnet is running"*
- *"List contracts in my ZetaChain project"*
- *"Help me understand ZetaChain CLI commands"*

## 🔍 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill existing process
lsof -ti :7001 | xargs kill -9

# Or use different port
MCP_PORT=7002 node server.js
```

**ZetaChain CLI not found:**
```bash
# Install ZetaChain CLI
npm install -g zetachain

# Or check prerequisites
curl http://localhost:7001/prerequisites
```

**Localnet not starting:**
```bash
# Manual localnet start
zetachain localnet start

# Check status
zetachain localnet status
```

### Logs and Debugging

```bash
# Check server logs
tail -f ~/.claude/logs/zetachain-mcp-cli.log

# Check if server is running
ps aux | grep "server.js"

# Test server directly
curl -v http://localhost:7001/health
```

## 📈 Next Steps

Ready for more advanced features? Check out:

- **[zetachain-mcp-server](../zetachain-mcp-server)** - Production-grade MCP server with full omnichain features
- **[ZetaChain Documentation](https://docs.zetachain.com)** - Official ZetaChain docs
- **[ZetaChain Examples](https://github.com/zetachain/examples)** - Example projects and tutorials

## 🤝 Contributing

We welcome contributions! Please see:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Keep it simple - this is the beginner-friendly tool
- Maintain single-file architecture
- Add comments for educational value
- Test with real ZetaChain projects

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[ZetaChain](https://zetachain.com)** - For the amazing omnichain platform
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - For the MCP specification
- **[Claude Code](https://claude.ai/code)** - For the development environment

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/zetachain-mcp-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/zetachain-mcp-cli/discussions)
- **ZetaChain Discord**: [Join the community](https://discord.gg/zetachain)

---

**Made with ❤️ for the ZetaChain community**

*Get started with ZetaChain development in minutes, not hours!*