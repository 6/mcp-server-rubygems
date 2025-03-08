import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { McpTool } from './types.js';
import { createErrorResponse } from './utils.js';

// Define the response schema for owner gems
const OwnerGemSchema = z.object({
  name: z.string(),
  downloads: z.number(),
  version: z.string(),
  version_downloads: z.number(),
  platform: z.string(),
  authors: z.string(),
  info: z.string(),
  licenses: z.array(z.string()).nullable(),
  project_uri: z.string(),
  gem_uri: z.string(),
  homepage_uri: z.string().nullable(),
  wiki_uri: z.string().nullable(),
  documentation_uri: z.string().nullable(),
  mailing_list_uri: z.string().nullable(),
  source_code_uri: z.string().nullable(),
  bug_tracker_uri: z.string().nullable(),
  funding_uri: z.string().nullable(),
});

type OwnerGem = z.infer<typeof OwnerGemSchema>;

// Define the input schema for the tool
const GetOwnerGemsInputSchema = z.object({
  owner_name: z
    .string()
    .min(1)
    .describe('Username of the RubyGem owner to fetch gems for'),
});

// Function to fetch gems owned by a specific user
async function getOwnerGems(ownerName: string): Promise<OwnerGem[]> {
  const response = await fetch(
    `https://rubygems.org/api/v1/owners/${ownerName}/gems.json`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Owner '${ownerName}' not found`);
    }
    throw new Error(`Failed to fetch gems for owner: ${response.statusText}`);
  }

  const data = await response.json();
  return z.array(OwnerGemSchema).parse(data);
}

// Tool definition
export const getOwnerGemsTool: McpTool = {
  name: 'get_owner_gems',
  description: 'Get all RubyGems owned by a specific user or organization',
  inputSchema: {
    type: 'object',
    properties: zodToJsonSchema(GetOwnerGemsInputSchema),
  },
  handler: async (args: Record<string, unknown> | undefined) => {
    const { owner_name } = GetOwnerGemsInputSchema.parse(args || {});

    try {
      const ownerGems = await getOwnerGems(owner_name);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(ownerGems, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      return createErrorResponse(error, 'Failed to fetch gems for owner');
    }
  },
};
