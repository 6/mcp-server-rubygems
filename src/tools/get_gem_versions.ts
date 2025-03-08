import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { McpTool } from './types.js';
import { createErrorResponse } from './utils.js';

// Define the response schema for RubyGem versions
const GemVersionSchema = z.object({
  number: z.string(),
  created_at: z.string(),
  summary: z.string().nullable(),
  platform: z.string(),
  downloads_count: z.number(),
  prerelease: z.boolean().optional(),
});

type GemVersion = z.infer<typeof GemVersionSchema>;

// Define the input schema for the tool
const GetGemVersionsInputSchema = z.object({
  gem_name: z
    .string()
    .min(1)
    .describe('Name of the RubyGem to fetch versions for'),
});

// Function to fetch RubyGem versions
async function getGemVersions(gemName: string): Promise<GemVersion[]> {
  const response = await fetch(
    `https://rubygems.org/api/v1/versions/${gemName}.json`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`RubyGem '${gemName}' not found`);
    }
    throw new Error(`Failed to fetch versions: ${response.statusText}`);
  }

  const data = await response.json();
  return z.array(GemVersionSchema).parse(data);
}

// Tool definition
export const getGemVersionsTool: McpTool = {
  name: 'get_gem_versions',
  description: 'Get all available versions of a specific RubyGem',
  inputSchema: {
    type: 'object',
    properties: zodToJsonSchema(GetGemVersionsInputSchema),
  },
  handler: async (args: Record<string, unknown> | undefined) => {
    const { gem_name } = GetGemVersionsInputSchema.parse(args || {});

    try {
      const versions = await getGemVersions(gem_name);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(versions, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      return createErrorResponse(error, 'Failed to fetch gem versions');
    }
  },
};
