import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Define the response schema for RubyGem info
export const RubyGemInfoSchema = z.object({
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

export type RubyGemInfo = z.infer<typeof RubyGemInfoSchema>;

// Define the input schema for the tool
export const GetRubyGemInfoInputSchema = z.object({
  rubygem_name: z.string().describe('Name of the RubyGem to fetch information for'),
});

// Convert Zod schema to JSON schema for MCP
export const getRubyGemInfoJsonSchema = zodToJsonSchema(GetRubyGemInfoInputSchema);

// Function to fetch RubyGem info
export async function getRubyGemInfo(gemName: string): Promise<RubyGemInfo> {
  const response = await fetch(`https://rubygems.org/api/v1/gems/${gemName}.json`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`RubyGem '${gemName}' not found`);
    }
    throw new Error(`Failed to fetch RubyGem info: ${response.statusText}`);
  }

  const data = await response.json();
  return RubyGemInfoSchema.parse(data);
}
