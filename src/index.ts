import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getRubyGemInfo, getRubyGemInfoJsonSchema } from "./tools/rubygems.js";

/**
 * Create an MCP server with capabilities for resources (to list/read notes),
 * tools (to create new notes), and prompts (to summarize notes).
 */
const server = new Server(
  {
    name: "mcp-server-rubygems",
    version: "0.1.0",
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
 * Exposes tools for creating notes and fetching RubyGem information.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_rubygem_info",
        description: "Get information about a RubyGem from the RubyGems.org API",
        inputSchema: getRubyGemInfoJsonSchema
      }
    ]
  };
});

/**
 * Handler for tool calls.
 * Handles both note creation and RubyGem info fetching.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_rubygem_info": {
      const gemName = String(request.params.arguments?.rubygem_name);
      if (!gemName) {
        throw new Error("RubyGem name is required");
      }

      try {
        const gemInfo = await getRubyGemInfo(gemName);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(gemInfo, null, 2)
          }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch RubyGem info: ${error.message}`);
      }
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
