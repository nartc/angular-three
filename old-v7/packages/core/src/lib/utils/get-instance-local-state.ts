import type { NgtInstanceLocalState, NgtUnknownRecord } from '../types';

export function getInstanceLocalState<TInstance extends object = NgtUnknownRecord>(
  obj: TInstance | undefined
): NgtInstanceLocalState | undefined {
  if (!obj) return undefined;
  return (obj as NgtUnknownRecord)['__ngt__'] as NgtInstanceLocalState;
}
