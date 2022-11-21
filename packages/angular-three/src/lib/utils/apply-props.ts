import * as THREE from 'three';
import type { NgtAnyConstructor, NgtAnyFunction, NgtAnyRecord, NgtInstanceLocalState } from '../types';
import { checkNeedsUpdate } from './check-update';
import { getInstanceLocalState } from './get-instance-local-state';
import { invalidateInstance } from './instance';
import { is } from './is';

const DEFAULT = '__default';

export function diffProps<TInstance extends object>(
    instance: TInstance,
    props: NgtAnyRecord,
    previousProps: NgtAnyRecord = {},
    remove = false
) {
    const localState = getInstanceLocalState(instance) || ({} as NgtInstanceLocalState);
    const propsEntries = Object.entries(props);
    const changes: [key: string, value: unknown][] = [];

    // Catch removed props, prepend them, so they can be reset or removed
    if (remove) {
        const previousKeys = Object.keys(previousProps);
        for (const previousKey of previousKeys) {
            // @ts-ignore
            if (!Object.hasOwn(props, previousKey)) {
                propsEntries.unshift([previousKey, DEFAULT + 'remove']);
            }
        }
    }

    for (const [propKey, propValue] of propsEntries) {
        if (is.equ(propValue, previousProps[propKey])) continue;
        changes.push([propKey, propValue]);
    }

    const memoized: NgtAnyRecord = { ...props };
    if (localState.memoized && localState.memoized['args']) {
        memoized['args'] = localState.memoized['args'];
    }

    if (localState.memoized && localState.memoized['attach']) {
        memoized['attach'] = localState.memoized['attach'] || localState.attach;
    }

    return { changes, memoized };
}

export function applyProps<TInstance extends object>(instance: TInstance, props: NgtAnyRecord): TInstance {
    // props is empty
    if (!Object.keys(props).length) return instance;

    // Filter equals, events and reserved props
    const localState = getInstanceLocalState(instance) || ({} as NgtInstanceLocalState);
    const rootState = localState.stateFactory?.();
    const { changes, memoized } = diffProps(instance, props);
    const instanceHandlers = localState.eventCount;

    if (getInstanceLocalState(instance)) {
        getInstanceLocalState(instance)!.memoized = memoized;
    }

    for (let i = 0; i < changes.length; i++) {
        const key = changes[i][0];
        const currentInstance = instance;
        const targetProp = (currentInstance as NgtAnyRecord)[key] as NgtAnyRecord;
        let value = changes[i][1];

        if (is.ref(value)) {
            value = value.value;
        }

        if (value === DEFAULT + 'remove') {
            if (targetProp && targetProp.constructor) {
                // use the prop constructor to find the default it should be
                value = new (targetProp.constructor as NgtAnyConstructor)(...((memoized['args'] as unknown[]) ?? []));
            } else if (currentInstance.constructor) {
                const dummyInstance = new (currentInstance.constructor as NgtAnyConstructor)(
                    ...((getInstanceLocalState(currentInstance)?.memoized?.['args'] as unknown[]) || [])
                );
                value = dummyInstance[targetProp as unknown as string];
                // destroy the instance
                if (dummyInstance.dispose) dummyInstance.dispose();
            } else {
                value = 0;
            }
        }

        // Special treatment for objects with support for set/copy, and layers
        if (targetProp && targetProp['set'] && (targetProp['copy'] || targetProp instanceof THREE.Layers)) {
            const isColor = targetProp instanceof THREE.Color;
            // If value is an array
            if (Array.isArray(value)) {
                if (targetProp['fromArray']) (targetProp['fromArray'] as NgtAnyFunction)(value);
                else (targetProp['set'] as NgtAnyFunction)(...value);
            }
            // Test again target.copy(class) next ...
            else if (
                targetProp['copy'] &&
                value &&
                value.constructor &&
                targetProp.constructor.name === value.constructor.name
            ) {
                (targetProp['copy'] as NgtAnyFunction)(value);
                if (!is.supportColorManagement() && !rootState.linear && isColor) {
                    targetProp['convertSRGBToLinear']();
                }
            }
            // If nothing else fits, just set the single value, ignore undefined
            // https://github.com/pmndrs/react-three-fiber/issues/274
            else if (value !== undefined) {
                const isColor = targetProp instanceof THREE.Color;
                // Allow setting array scalars
                if (!isColor && targetProp['setScalar']) (targetProp['setScalar'] as NgtAnyFunction)(value);
                // Layers have no copy function, we must therefore copy the mask property
                else if (targetProp instanceof THREE.Layers && value instanceof THREE.Layers)
                    targetProp.mask = value.mask;
                // Otherwise just set ...
                else (targetProp['set'] as NgtAnyFunction)(value);
                // For versions of three which don't support THREE.ColorManagement,
                // Auto-convert sRGB colors
                // https://github.com/pmndrs/react-three-fiber/issues/344
                if (!is.supportColorManagement() && !rootState.linear && isColor) targetProp.convertSRGBToLinear();
            }
            // Else, just overwrite the value
        } else {
            (currentInstance as NgtAnyRecord)[key] = value;
            // Auto-convert sRGB textures, for now ...
            // https://github.com/pmndrs/react-three-fiber/issues/344
            if (!rootState?.linear && (currentInstance as NgtAnyRecord)[key] instanceof THREE.Texture) {
                ((currentInstance as NgtAnyRecord)[key] as NgtAnyRecord)['encoding'] = THREE.sRGBEncoding;
            }
        }

        checkNeedsUpdate(targetProp);
        invalidateInstance(instance);
    }

    if (
        localState.parentRef &&
        rootState.internal &&
        (instance as NgtAnyRecord)['raycast'] &&
        instanceHandlers !== localState.eventCount
    ) {
        // Pre-emptively remove the instance from the interaction manager
        rootState.removeInteraction((instance as NgtAnyRecord)['uuid'] as string);
        // Add the instance to the interaction manager only when it has handlers
        if (localState.eventCount) rootState.addInteraction(instance as unknown as THREE.Object3D);
    }

    return instance;
}
