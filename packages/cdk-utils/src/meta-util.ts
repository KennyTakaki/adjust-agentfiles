import type { Construct } from 'constructs';

export interface Meta {
  stage: string;
  project: string;
  service: string;
}

/**
 * Retrieve stage / project / service in the order:
 * ① context → ② environment variable → ③ default
 */

const norm = (v: unknown): string | undefined => {
  if (v == null) return undefined;
  if (typeof v !== 'string') return String(v);
  const t = v.trim();
  return t === '' || t === 'undefined' ? undefined : t;
};
export function getMeta(scope: Construct): Meta {
  const node = scope.node;
  const stage = norm(node.tryGetContext('stage')) ?? norm(process.env.STAGE) ?? 'dev';
  const project = norm(node.tryGetContext('project')) ?? norm(process.env.PROJECT) ?? 'myproject';
  const service = norm(node.tryGetContext('service')) ?? norm(process.env.SERVICE) ?? 'web';
  return { stage, project, service };
}
