import type { NgtUnknownInstance } from '../types';
import { applyProps } from './apply-props';

export function mutate<T extends Record<string, unknown>>(
    object: T,
    path: string[],
    value: unknown
): void {
    const { decomposedPath, base } = decomposePath(path);

    if (base === undefined) {
        return;
    }

    // assign an empty object in order to spread object
    assignEmpty(object, base);

    // Determine if there is still layers to traverse
    if (decomposedPath.length <= 1) {
        applyProps(object as NgtUnknownInstance, { [base]: value });
    } else {
        mutate(
            object[base] as Record<string, unknown>,
            decomposedPath.slice(1),
            value
        );
    }
}

function decomposePath(path: string[]): {
    decomposedPath: string[];
    base: string;
} {
    if (path.length < 1) {
        return { base: '', decomposedPath: [] };
    }
    const decomposedPath = path;
    const base = path[0];
    return { base, decomposedPath };
}

function assignEmpty(obj: Record<string, unknown>, base: string) {
    if (
        !Object.prototype.hasOwnProperty.call(obj, base) &&
        Reflect &&
        !!Reflect.has &&
        !Reflect.has(obj, base)
    ) {
        obj[base] = {};
    }
}
