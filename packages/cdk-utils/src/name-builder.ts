import { Environment } from 'aws-cdk-lib';
import { Meta } from './meta-util';

export interface NameBuilderOptions {
  prefix?: string; // Example: bucketNamePrefix
  maxLen?: number; // Example: S3 allows up to 63 characters
  requireStartEndAlnum?: boolean; // Ensure the name starts/ends with alphanumeric characters (for S3 compatibility)
  includeAccount?: boolean; // Whether to include the account ID
  includeRegion?: boolean; // Whether to include the region
}

/**
 * Function that generates a resource name from metadata and environment information
 */
export function nameBuilder(
  meta: Meta,
  env: Environment,
  resourceType: string,
  opts: NameBuilderOptions = {},
): string {
  const {
    prefix,
    maxLen = 63,
    requireStartEndAlnum = true,
    includeAccount = true,
    includeRegion = false,
  } = opts;

  const { stage, project, service } = meta;

  // Build segments
  const segments = [
    prefix,
    stage,
    includeAccount ? env.account : undefined,
    project,
    service,
    resourceType,
    includeRegion ? env.region : undefined,
  ].filter((v): v is string => !!v && v.length > 0);

  // Generate name
  let name = segments
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace disallowed characters with "-"
    .replace(/-{2,}/g, '-'); // Collapse consecutive hyphens

  // Remove leading and trailing hyphens (if required)
  if (requireStartEndAlnum) {
    name = name.replace(/^-+/, '').replace(/-+$/, '');
  }

  // Trim to maximum length
  name = name.slice(0, maxLen);

  // Remove leading/trailing hyphens again and guard against empty string
  if (requireStartEndAlnum) {
    name = name.replace(/^-+/, '').replace(/-+$/, '');
    if (!name) name = 'x0'; // Guard against empty name
  }

  return name;
}
