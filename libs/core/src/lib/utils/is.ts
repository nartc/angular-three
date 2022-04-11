import type {
    BufferGeometry,
    Material,
    OrthographicCamera,
    PerspectiveCamera,
} from 'three';
import * as THREE from 'three';
import type { EquConfig } from '../types';

export const is = {
    obj: (a: unknown) =>
        a === Object(a) && !is.arr(a) && typeof a !== 'function',
    material: (a: unknown): a is Material =>
        !!(a as Record<string, unknown>)['isMaterial'],
    geometry: (a: unknown): a is BufferGeometry =>
        !!(a as Record<string, unknown>)['isBufferGeometry'],
    orthographic: (a: unknown): a is OrthographicCamera =>
        !!a && (a as THREE.OrthographicCamera).isOrthographicCamera,
    perspective: (a: unknown): a is PerspectiveCamera =>
        !!a && (a as THREE.PerspectiveCamera).isPerspectiveCamera,
    fun: (a: unknown): a is Function => typeof a === 'function',
    str: (a: unknown): a is string => typeof a === 'string',
    num: (a: unknown): a is number => typeof a === 'number',
    boo: (a: unknown): a is boolean => typeof a === 'boolean',
    und: (a: unknown) => a === void 0,
    arr: (a: unknown) => Array.isArray(a),
    equ(
        a: any,
        b: any,
        {
            arrays = 'shallow',
            objects = 'reference',
            strict = true,
        }: EquConfig = {}
    ) {
        // Wrong type or one of the two undefined, doesn't match
        if (typeof a !== typeof b || !!a !== !!b) return false;
        // Atomic, just compare a against b
        if (is.str(a) || is.num(a)) return a === b;
        const isObj = is.obj(a);
        if (isObj && objects === 'reference') return a === b;
        const isArr = is.arr(a);
        if (isArr && arrays === 'reference') return a === b;
        // Array or Object, shallow compare first to see if it's a match
        if ((isArr || isObj) && a === b) return true;
        // Last resort, go through keys
        let i;
        for (i in a) if (!(i in b)) return false;
        for (i in strict ? b : a) if (a[i] !== b[i]) return false;
        if (is.und(i)) {
            if (isArr && a.length === 0 && b.length === 0) return true;
            if (
                isObj &&
                Object.keys(a).length === 0 &&
                Object.keys(b).length === 0
            )
                return true;
            if (a !== b) return false;
        }
        return true;
    },
};
