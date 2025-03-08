import { McpToolResponse } from './types.js';

/**
 * Extracts a readable error message from any error object
 *
 * @param error - The error object
 * @returns A string representation of the error
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Creates a standardized error response with context
 *
 * @param message - The error message
 * @returns An MCP tool response with error information
 */
export function createErrorResponse(message: string): McpToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: message,
      },
    ],
  };
}
