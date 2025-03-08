#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getRubyGemInfoTool } from './tools/get_rubygem_info.js';
import { getGemVersionsTool } from './tools/get_gem_versions.js';
import { getGemReverseDependenciesTool } from './tools/get_gem_reverse_dependencies.js';
import { getGemOwnersTool } from './tools/get_gem_owners.js';
import { getOwnerGemsTool } from './tools/get_owner_gems.js';
import { searchRubyGemsTool } from './tools/search_rubygems.js';
import { McpTool } from './tools/types.js';

/**
 * Define the array of available tools
 */
const tools: readonly McpTool[] = [
  getRubyGemInfoTool,
  searchRubyGemsTool,
  getGemVersionsTool,
  getGemReverseDependenciesTool,
  getOwnerGemsTool,
  getGemOwnersTool,
] as const;

/**
 * Create an MCP server with capabilities for resources (to list/read notes),
 * tools (to create new notes), and prompts (to summarize notes).
 */
const server = new Server(
  {
    name: 'mcp-server-rubygems',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
      // resources: {},
      // prompts: {},
    },
  }
);

/**
 * Handler that lists available tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

/**
 * Handler for tool calls.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find((t) => t.name === request.params.name);
  if (!tool) {
    throw new Error('Unknown tool');
  }

  return tool.handler(request.params.arguments);
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('mcp-server-rubygems started on stdio!');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
