# ZetaChain MCP

A simple Model Context Protocol (MCP) server for Claude Code integration with ZetaChain development tools.

## Features

- ZetaChain CLI command execution
- Contract discovery and inspection  
- Localnet management
- Project structure analysis

## Installation

```bash
git clone https://github.com/ExpertVagabond/zetachain-mcp.git
cd zetachain-mcp
npm install
npm start
```

## API Endpoints

- `GET /health` - Server health check
- `GET /contracts` - List project contracts
- `GET /zetachain?cmd=<command>` - Execute ZetaChain CLI commands
- `GET /project-info` - Project structure info
- `GET /prerequisites` - Check development prerequisites

## Configuration

Set environment variables:
- `ZETA_PROJECT_PATH` - Path to your ZetaChain project (default: `~/Projects/zetachain`)

## Development

```bash
# Install prerequisites
chmod +x scripts/install-prerequisites.sh
./scripts/install-prerequisites.sh

# Start with file watching
npm run dev
```

## Claude Code Integration

Add to Claude Code settings:

```json
{
  "mcpServers": {
    "zetachain-cli": {
      "command": "node",
      "args": ["/path/to/zetachain-mcp/server.js"]
    }
  }
}
```

## Requirements

- Node.js 16+
- ZetaChain CLI: `npm install -g zetachain@latest`

## License

MIT