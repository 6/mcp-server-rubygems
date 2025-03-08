# mcp-server-rubygems [![Default](https://github.com/6/mcp-server-rubygems/actions/workflows/default.yml/badge.svg)](https://github.com/6/mcp-server-rubygems/actions/workflows/default.yml)

A [Model Context Protocol](https://modelcontextprotocol.io/) server for fetching rubygems metadata via [rubygems.org API](https://guides.rubygems.org/rubygems-org-api/).

## Tools

This MCP server provides the following tools for interacting with the RubyGems.org API:

| Tool                           | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| `get_rubygem_info`             | Get information about a RubyGem                           |
| `search_rubygems`              | Search for RubyGems matching a query string               |
| `get_gem_versions`             | Get all available versions of a specific RubyGem          |
| `get_gem_reverse_dependencies` | Get gems that depend on a specific RubyGem                |
| `get_owner_gems`               | Get all RubyGems owned by a specific user or organization |
| `get_gem_owners`               | Get the owners of a specific RubyGem                      |

## Usage

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

For development with auto-rebuild:

```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-server-rubygems": {
      "command": "/path/to/mcp-server-rubygems/build/index.js"
    }
  }
}
```

It should be similar on MCP clients like Cursor, Cline, etc -- just add the `command` from above in your config.

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
