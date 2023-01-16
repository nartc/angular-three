import { NgtAnyRecord, NgtInstanceLocalState } from '../types';

export function getLocalState<TInstance extends object = NgtAnyRecord>(
    obj: TInstance | undefined
): NgtInstanceLocalState {
    if (!obj) return {} as unknown as NgtInstanceLocalState;
    return (obj as NgtAnyRecord)['__ngt__'] as NgtInstanceLocalState;
}
