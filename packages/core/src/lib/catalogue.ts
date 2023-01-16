import { InjectionToken } from '@angular/core';
import type { NgtAnyConstructor } from './types';
import { createInject } from './utils/di';

const catalogue: Record<string, NgtAnyConstructor> = {};

export function extend(objects: object): void {
    Object.assign(catalogue, objects);
}

export const NGT_CATALOGUE = new InjectionToken<Record<string, NgtAnyConstructor>>('THREE Constructors Catalogue', {
    factory: () => catalogue,
});

export const injectNgtCatalogue = createInject(NGT_CATALOGUE);
