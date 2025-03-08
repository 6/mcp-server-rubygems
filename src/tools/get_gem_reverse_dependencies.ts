import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { McpTool } from './types.js';
import { createErrorResponse } from './utils.js';

// Define the input schema for the tool
const GetGemReverseDependenciesInputSchema = z.object({
  gem_name: z
    .string()
    .min(1)
    .describe('Name of the RubyGem to fetch reverse dependencies for'),
});

// Function to fetch RubyGem reverse dependencies
async function getGemReverseDependencies(gemName: string): Promise<string[]> {
  const response = await fetch(
    `https://rubygems.org/api/v1/gems/${gemName}/reverse_dependencies.json`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`RubyGem '${gemName}' not found`);
    }
    throw new Error(
      `Failed to fetch reverse dependencies: ${response.statusText}`
    );
  }

  const data = await response.json();
  return z.array(z.string()).parse(data);
}

// Tool definition
export const getGemReverseDependenciesTool: McpTool = {
  name: 'get_gem_reverse_dependencies',
  description: 'Get gems that depend on a specific RubyGem',
  inputSchema: {
    type: 'object',
    properties: zodToJsonSchema(GetGemReverseDependenciesInputSchema),
  },
  handler: async (args: Record<string, unknown> | undefined) => {
    const { gem_name } = GetGemReverseDependenciesInputSchema.parse(args || {});

    try {
      const reverseDependencies = await getGemReverseDependencies(gem_name);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(reverseDependencies, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      return createErrorResponse(
        error,
        'Failed to fetch gem reverse dependencies'
      );
    }
  },
};
