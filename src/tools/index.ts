import { getRubyGemInfoTool } from './get_rubygem_info.js';
import { getGemVersionsTool } from './get_gem_versions.js';
import { getGemReverseDependenciesTool } from './get_gem_reverse_dependencies.js';
import { getOwnerGemsTool } from './get_owner_gems.js';
import { searchRubyGemsTool } from './search_rubygems.js';
import { McpTool } from './types.js';

export const tools: readonly McpTool[] = [
  getRubyGemInfoTool,
  searchRubyGemsTool,
  getGemVersionsTool,
  getGemReverseDependenciesTool,
  getOwnerGemsTool,
] as const;
