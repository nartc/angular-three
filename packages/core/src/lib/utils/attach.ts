import { NgtAnyFunction, NgtAnyRecord, NgtAttachFunction } from '../types';
import { applyProps } from './apply-props';
import { getLocalState } from './local-state';

export function attach<TObject extends NgtAnyRecord>(object: TObject, value: unknown, paths: string[] = []): void {
    const [base, ...remaining] = paths;
    if (!base) return;

    if (remaining.length === 0) {
        applyProps(object, { [base]: value });
    } else {
        assignEmpty(object, base);
        attach(object[base], value, remaining);
    }
}

export function detach<TParent extends NgtAnyRecord, TChild extends NgtAnyRecord>(
    parent: TParent,
    child: TChild,
    attachProp: string[] | NgtAttachFunction
) {
    const childLocalState = getLocalState(child);
    if (Array.isArray(attachProp)) {
        const previous = childLocalState.previousAttach;
        attach(parent, previous, attachProp);
    } else {
        (childLocalState.previousAttach as NgtAnyFunction)();
    }
}

function assignEmpty(obj: NgtAnyRecord, base: string) {
    if ((!Object.hasOwn(obj, base) && Reflect && !!Reflect.has && !Reflect.has(obj, base)) || obj[base] === undefined) {
        obj[base] = {};
    }
}
