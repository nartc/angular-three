import { BehaviorSubject } from 'rxjs';
import type { NgtAnyRecord, NgtInstanceLocalState, NgtInstanceNode } from '../types';
import { checkUpdate } from './update';

export function getLocalState<TInstance extends object = NgtAnyRecord>(
    obj: TInstance | undefined
): NgtInstanceLocalState {
    if (!obj) return {} as unknown as NgtInstanceLocalState;
    return (obj as NgtAnyRecord)['__ngt__'] as NgtInstanceLocalState;
}

export function invalidateInstance<TInstance extends object>(instance: TInstance) {
    const state = getLocalState(instance)?.store.get();
    if (state && state?.internal?.frames === 0) state.invalidate();
    checkUpdate(instance);
}

export function prepare<TInstance extends object = NgtAnyRecord>(
    object: TInstance,
    localState?: Partial<NgtInstanceLocalState>
): NgtInstanceNode<TInstance> {
    const instance = object as unknown as NgtInstanceNode<TInstance>;

    if (localState?.primitive || !instance.__ngt__) {
        const {
            objects = new BehaviorSubject<NgtInstanceNode[]>([]),
            nonObjects = new BehaviorSubject<NgtInstanceNode[]>([]),
            ...rest
        } = localState || {};

        instance.__ngt__ = {
            previousAttach: null,
            store: null,
            parent: null,
            memoized: {},
            eventCount: 0,
            handlers: {},
            objects,
            nonObjects,
            addObject: (object) => {
                objects.next([...objects.value, object]);
                notifyAncestors(getLocalState(instance)?.parent);
            },
            removeObject: (object) => {
                objects.next(objects.value.filter((obj) => obj !== object));
                notifyAncestors(getLocalState(instance)?.parent);
            },
            addNonObject: (object) => {
                nonObjects.next([...nonObjects.value, object]);
                notifyAncestors(getLocalState(instance)?.parent);
            },
            removeNonObject: (object) => {
                nonObjects.next(nonObjects.value.filter((obj) => obj !== object));
                notifyAncestors(getLocalState(instance)?.parent);
            },
            ...rest,
        } as NgtInstanceLocalState;
    }

    return instance;
}

function notifyAncestors(instance: NgtInstanceNode | null) {
    if (!instance) return;
    const localState = getLocalState(instance);
    if (!localState) return;

    localState.objects.next([...localState.objects.value]);
    localState.nonObjects.next([...localState.nonObjects.value]);

    notifyAncestors(localState.parent);
}
