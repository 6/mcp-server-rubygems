import { getRubyGemInfoTool } from './get_rubygem_info.js';
import { searchRubyGemsTool } from './search_rubygems.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: readonly Tool[] = [
  getRubyGemInfoTool,
  searchRubyGemsTool,
] as const;
