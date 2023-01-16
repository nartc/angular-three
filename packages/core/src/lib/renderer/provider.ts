import { ChangeDetectorRef, RendererFactory2 } from '@angular/core';
import { NgtStore } from '../stores/store';
import { provideNgtCompoundPrefixes } from './di';
import { NgtRendererFactory } from './renderer';

export type NgtRendererProviderOptions = {
    store: NgtStore;
    changeDetectorRef: ChangeDetectorRef;
    compoundPrefixes?: string[];
};

export function provideNgtRenderer({ store, changeDetectorRef, compoundPrefixes }: NgtRendererProviderOptions) {
    if (!compoundPrefixes) {
        compoundPrefixes = [];
    }

    if (!compoundPrefixes.includes('ngts')) {
        compoundPrefixes.push('ngts');
    }

    if (!compoundPrefixes.includes('ngtp')) {
        compoundPrefixes.push('ngtp');
    }

    return [
        { provide: RendererFactory2, useClass: NgtRendererFactory },
        { provide: NgtStore, useValue: store },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
        provideNgtCompoundPrefixes(compoundPrefixes),
    ];
}
