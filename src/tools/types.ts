/**
 * Type definition for an MCP tool response content item
 */
export type McpToolResponseContent = {
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
export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown> | undefined) => Promise<McpToolResponse>;
}
