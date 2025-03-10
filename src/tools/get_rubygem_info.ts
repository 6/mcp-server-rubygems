import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { type McpTool } from './types.js';
import { createErrorResponse } from './utils.js';

// Define the response schema for RubyGem info
const RubyGemInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  downloads: z.number(),
  info: z.string(),
  homepage_uri: z.string().nullable(),
  source_code_uri: z.string().nullable(),
  documentation_uri: z.string().nullable(),
  bug_tracker_uri: z.string().nullable(),
  authors: z.string(),
  licenses: z.array(z.string()),
  metadata: z.record(z.string(), z.any()).optional(),
});

type RubyGemInfo = z.infer<typeof RubyGemInfoSchema>;

// Define the input schema for the tool
const GetRubyGemInfoInputSchema = z.object({
  rubygem_name: z
    .string()
    .min(1)
    .describe('Name of the RubyGem to fetch information for'),
});

// Function to fetch RubyGem info
async function getRubyGemInfo(gemName: string): Promise<RubyGemInfo> {
  const response = await fetch(
    `https://rubygems.org/api/v1/gems/${gemName}.json`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`RubyGem '${gemName}' not found`);
    }
    throw new Error(`Failed to fetch RubyGem info: ${response.statusText}`);
  }

  const data = await response.json();
  return RubyGemInfoSchema.parse(data);
}

// Tool definition
export const getRubyGemInfoTool: McpTool = {
  name: 'get_rubygem_info',
  description: 'Get information about a RubyGem from the RubyGems.org API',
  inputSchema: {
    type: 'object',
    properties: zodToJsonSchema(GetRubyGemInfoInputSchema),
  },
  handler: async (args: Record<string, unknown> | undefined) => {
    const { rubygem_name } = GetRubyGemInfoInputSchema.parse(args || {});

    try {
      const gemInfo = await getRubyGemInfo(rubygem_name);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(gemInfo, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      // Return error context instead of throwing an error
      return createErrorResponse(error, 'Failed to fetch RubyGem info');
    }
  },
};
