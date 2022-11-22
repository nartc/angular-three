import * as THREE from 'three';
import type { NgtAnyConstructor, NgtDpr, NgtIntersection } from '../types';

const idCache: { [id: string]: boolean | undefined } = {};
export function makeId(event?: NgtIntersection): string {
    if (event) {
        return (event.eventObject || event.object).uuid + '/' + event.index + event.instanceId;
    }

    const newId = THREE.MathUtils.generateUUID();
    // ensure not already used
    if (!idCache[newId]) {
        idCache[newId] = true;
        return newId;
    }
    return makeId();
}

export function makeDpr(dpr: NgtDpr, window?: Window) {
    const target = window?.devicePixelRatio || 1;
    return Array.isArray(dpr) ? Math.min(Math.max(dpr[0], target), dpr[1]) : dpr;
}

export function make<TType extends NgtAnyConstructor>(
    type: TType,
    input?:
        | InstanceType<TType>
        | Parameters<typeof type.prototype['set']>
        | Parameters<typeof type.prototype['setScalar']>[0]
        | ConstructorParameters<TType>
): InstanceType<TType> {
    if (!input) return new type();

    if (input instanceof type) {
        return input as InstanceType<TType>;
    }

    if (!Array.isArray(input)) {
        input = typeof input === 'number' ? [input, input, input, input] : [input];
    }

    return new type(...(input as unknown[]));
}