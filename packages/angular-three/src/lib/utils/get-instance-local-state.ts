import type { NgtAnyRecord, NgtInstanceLocalState } from '../types';

export function getInstanceLocalState<TInstance extends object = NgtAnyRecord>(
    obj: TInstance | undefined
): NgtInstanceLocalState | undefined {
    if (!obj) return undefined;
    return (obj as NgtAnyRecord)['__ngt__'] as NgtInstanceLocalState;
}
