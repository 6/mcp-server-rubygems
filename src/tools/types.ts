import { type Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Type definition for an MCP tool response content item
 */
type McpToolResponseContent = {
  type: 'text';
  text: string;
};

/**
 * Type definition for an MCP tool response
 */
export type McpToolResponse = {
  content: McpToolResponseContent[];
};

/**
 * Type definition for an MCP tool
 */
export interface McpTool extends Tool {
  handler: (
    args: Record<string, unknown> | undefined
  ) => Promise<McpToolResponse>;
}
