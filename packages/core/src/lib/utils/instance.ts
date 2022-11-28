import { NgtInstance } from '../instance';
import { NgtRef } from '../ref';
import type { NgtAnyRecord, NgtInstanceNode, NgtStateFactory } from '../types';
import { applyProps } from './apply-props';
import { checkUpdate } from './check-update';
import { getInstanceLocalState } from './get-instance-local-state';
import { is } from './is';

export function invalidateInstance<TInstance extends object>(instance: TInstance) {
    const state = getInstanceLocalState(instance)?.stateFactory();
    if (state && state?.internal?.frames === 0) state.invalidate();
    checkUpdate(instance);
}

export function prepare<TInstance extends object = NgtAnyRecord>(
    instance: TInstance,
    parentStateFactory: NgtStateFactory,
    hostInstance?: NgtInstance,
    parentInstanceRef?: NgtRef,
    previousInstanceRef?: NgtRef,
    isPrimitive = false
): NgtInstanceNode<TInstance> {
    const previousInstanceInternal = getInstanceLocalState(previousInstanceRef?.value);

    const parent = parentInstanceRef
        ? parentInstanceRef
        : previousInstanceInternal
        ? previousInstanceInternal.parentRef
        : undefined;

    if (is.scene(instance)) {
        applyProps(instance, { dispose: null });
    }

    return Object.assign(instance, {
        __ngt__: {
            stateFactory: parentStateFactory,
            hostInstance,
            isPrimitive: !isPrimitive ? previousInstanceInternal?.isPrimitive : isPrimitive,
            eventCount: previousInstanceInternal?.eventCount ?? 0,
            handlers: previousInstanceInternal?.handlers ?? {},
            instancesRefs: previousInstanceInternal?.instancesRefs ?? new NgtRef([] as NgtRef[]),
            objectsRefs: previousInstanceInternal?.objectsRefs ?? new NgtRef([] as NgtRef[]),
            parentRef: parent ? (parent === instance || parent.value === instance ? null : parent) : null,
        },
    });
}
