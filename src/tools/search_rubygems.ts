import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Define the response schema for RubyGem search results
export const RubyGemSearchResultSchema = z.object({
  name: z.string(),
  version: z.string(),
  downloads: z.number(),
  info: z.string(),
  homepage_uri: z.string().nullable(),
  source_code_uri: z.string().nullable(),
  documentation_uri: z.string().nullable(),
  bug_tracker_uri: z.string().nullable(),
});

export type RubyGemSearchResult = z.infer<typeof RubyGemSearchResultSchema>;

// Define the input schema for the tool
export const SearchRubyGemsInputSchema = z.object({
  query: z.string().describe('Search query for finding RubyGems'),
});

export type SearchRubyGemsInput = z.infer<typeof SearchRubyGemsInputSchema>;

// Convert Zod schema to JSON schema for MCP
const inputJsonSchema = zodToJsonSchema(SearchRubyGemsInputSchema);

// Function to search RubyGems
async function searchRubyGems(query: string): Promise<RubyGemSearchResult[]> {
  const response = await fetch(`https://rubygems.org/api/v1/search.json?query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error(`Failed to search RubyGems: ${response.statusText}`);
  }

  const data = await response.json();
  return z.array(RubyGemSearchResultSchema).parse(data);
}

// Tool definition
export const searchRubyGemsTool = {
  name: 'search_rubygems',
  description: 'Search for RubyGems matching a query string. The search matches against gem names and descriptions. Returns up to 10 results, ordered by relevance. Example queries: "authentication", "rails middleware", "aws sdk"',
  inputSchema: inputJsonSchema,
  handler: async (args: Record<string, unknown> | undefined) => {
    const { query } = SearchRubyGemsInputSchema.parse(args || {});

    try {
      const results = await searchRubyGems(query);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(results.slice(0, 10), null, 2) // Limit to top 10 results for readability
        }]
      };
    } catch (error: any) {
      throw new Error(`Failed to search RubyGems: ${error.message}`);
    }
  }
} as const;
