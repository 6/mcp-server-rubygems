import { getRubyGemInfoTool } from './get_rubygem_info.js';
import { searchRubyGemsTool } from './search_rubygems.js';
import { McpTool } from './types.js';

export const tools: readonly McpTool[] = [
  getRubyGemInfoTool,
  searchRubyGemsTool,
] as const;
