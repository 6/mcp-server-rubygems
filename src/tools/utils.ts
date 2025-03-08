import { type McpToolResponse } from './types.js';

/**
 * Extracts a readable error message from any error object
 *
 * @param error - The error object
 * @returns A string representation of the error
 */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Creates a standardized error response
 *
 * @param error - The error object
 * @param prefix - Optional prefix for the error message
 * @returns An MCP tool response with error information
 */
export function createErrorResponse(
  error: unknown,
  prefix: string = ''
): McpToolResponse {
  const errorMessage = getErrorMessage(error);
  const fullMessage = prefix ? `${prefix}: ${errorMessage}` : errorMessage;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            error: true,
            message: fullMessage,
          },
          null,
          2
        ),
      },
    ],
  };
}
