import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { type McpTool } from './types.js';
import { createErrorResponse } from './utils.js';

// Define the response schema for gem owners
const GemOwnerSchema = z.object({
  id: z.number(),
  handle: z.string(),
  email: z.string().optional(),
});

type GemOwner = z.infer<typeof GemOwnerSchema>;

// Define the input schema for the tool
const GetGemOwnersInputSchema = z.object({
  gem_name: z
    .string()
    .min(1)
    .describe('Name of the RubyGem to fetch owners for'),
});

// Function to fetch owners of a specific gem
async function getGemOwners(gemName: string): Promise<GemOwner[]> {
  const response = await fetch(
    `https://rubygems.org/api/v1/gems/${gemName}/owners.json`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`RubyGem '${gemName}' not found`);
    }
    throw new Error(`Failed to fetch gem owners: ${response.statusText}`);
  }

  const data = await response.json();
  return z.array(GemOwnerSchema).parse(data);
}

// Tool definition
export const getGemOwnersTool: McpTool = {
  name: 'get_gem_owners',
  description: 'Get the owners of a specific RubyGem',
  inputSchema: {
    type: 'object',
    properties: zodToJsonSchema(GetGemOwnersInputSchema),
  },
  handler: async (args: Record<string, unknown> | undefined) => {
    const { gem_name } = GetGemOwnersInputSchema.parse(args || {});

    try {
      const owners = await getGemOwners(gem_name);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(owners, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      return createErrorResponse(error, 'Failed to fetch gem owners');
    }
  },
};
