import { StoreApi } from 'zustand/vanilla';
import type { NgtAnyRecord, NgtInstanceLocalState, NgtInstanceRendererState } from '../types';

export function instanceLocalState<TInstance extends object = NgtAnyRecord>(
  obj: TInstance | undefined
): NgtInstanceLocalState | undefined {
  if (!obj) return undefined;
  return (obj as NgtAnyRecord)['__ngt__'] as NgtInstanceLocalState;
}

export function instanceRendererState(
  obj: NgtAnyRecord | undefined
): StoreApi<NgtInstanceRendererState> | undefined {
  return instanceLocalState(obj)?.__ngt_renderer__;
}
