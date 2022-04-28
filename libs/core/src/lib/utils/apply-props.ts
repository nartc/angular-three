import * as THREE from 'three';
import type {
    AnyConstructor,
    NgtInstanceInternal,
    NgtUnknownInstance,
    UnknownRecord,
} from '../types';
import { checkNeedsUpdate } from './check-needs-update';
import { is } from './is';

export function applyProps<TInstance extends object = UnknownRecord>(
    instance: TInstance,
    props: UnknownRecord
): void {
    // props is empty
    if (!Object.keys(props).length) return;

    const instanceInternal: NgtInstanceInternal =
        (instance as NgtUnknownInstance).__ngt__ || {};
    const root = instanceInternal.root;
    const rootState = root?.() ?? {};

    if ('__ngt__' in props) {
        (instance as NgtUnknownInstance).__ngt__ = (props as any)
            .__ngt__ as NgtInstanceInternal;
    }

    /** TODO: check if this is still needed */
    // if (
    //     (instance as UnknownRecord)['set'] != null &&
    //     typeof (instance as UnknownRecord)['set'] === 'function' &&
    //     !(instance instanceof THREE.Raycaster)
    // ) {
    //     try {
    //         ((instance as UnknownRecord)['set'] as Function)(props);
    //     } catch (e) {
    //         console.info(
    //             `Swallowing erroneous "set" invoked on ${instance.constructor.name} as non fatal: ${e}`
    //         );
    //     }
    // }

    for (const entry of Object.entries(props)) {
        const key = entry[0];
        let prop = entry[1];

        // raycast is null or undefined. we'll skip
        if (key === 'raycast' && prop == undefined) continue;

        if (is.ref(prop)) {
            prop = prop.value;
        }

        const currentInstance = instance;
        const target = (currentInstance as UnknownRecord)[key] as UnknownRecord;

        if (
            target &&
            target['set'] &&
            (target['copy'] || target instanceof THREE.Layers)
        ) {
            // If value is an array
            if (is.arr(prop)) {
                if (target['fromArray'])
                    (target['fromArray'] as Function)(prop);
                else (target['set'] as Function)(...prop);
            } else if (
                target['copy'] &&
                prop &&
                (prop as AnyConstructor<unknown>).constructor &&
                target.constructor.name ===
                    (prop as AnyConstructor<unknown>).constructor.name
            ) {
                (target['copy'] as Function)(prop);
            } // If nothing else fits, just set the single value, ignore undefined
            // https://github.com/pmndrs/react-three-fiber/issues/274
            else if (prop !== undefined) {
                const isColor = target instanceof THREE.Color;
                // Allow setting array scalars
                if (!isColor && target['setScalar']) {
                    (target['setScalar'] as Function)(prop);
                }
                // Layers have no copy function, we must therefore copy the mask property
                else if (
                    target instanceof THREE.Layers &&
                    prop instanceof THREE.Layers
                ) {
                    target.mask = prop.mask;
                }
                // Otherwise just set ...
                else {
                    (target['set'] as Function)(prop);
                }
                // For versions of three which don't support THREE.ColorManagement,
                // Auto-convert sRGB colors
                // https://github.com/pmndrs/react-three-fiber/issues/344
                const supportsColorManagement = (THREE as any).ColorManagement;
                if (!supportsColorManagement && !rootState.linear && isColor) {
                    target.convertSRGBToLinear();
                }
            }
        } else {
            (currentInstance as UnknownRecord)[key] = prop;
            // Auto-convert sRGB textures, for now ...
            // https://github.com/pmndrs/react-three-fiber/issues/344
            if (
                !rootState.linear &&
                (currentInstance as UnknownRecord)[key] instanceof THREE.Texture
            ) {
                (
                    (currentInstance as UnknownRecord)[key] as THREE.Texture
                ).encoding = THREE.sRGBEncoding;
            }
        }

        checkNeedsUpdate(prop);
        checkNeedsUpdate(target);
    }
}
