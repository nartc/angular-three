import { ElementRef } from '@angular/core';
import type {
  NgtAnyRecord,
  NgtInstanceLocalState,
  NgtInstanceNode,
  NgtInstanceRendererState,
} from '../types';

export function instanceLocalState<TInstance extends object = NgtAnyRecord>(
  obj: TInstance | undefined
): NgtInstanceLocalState | undefined {
  if (!obj) return undefined;
  return (obj as NgtAnyRecord)['__ngt__'] as NgtInstanceLocalState;
}

export function instanceRendererState(
  obj: NgtAnyRecord | undefined
): NgtInstanceRendererState | undefined {
  if (!obj) return undefined;
  return obj['__ngt_renderer__'] as NgtInstanceRendererState;
}

export function instanceFromElementRef<T extends object>(
  elementRef: ElementRef<HTMLElement>
): T & Omit<NgtInstanceNode, '__ngt_renderer__'> {
  return instanceRendererState(elementRef.nativeElement)!.instance;
}
