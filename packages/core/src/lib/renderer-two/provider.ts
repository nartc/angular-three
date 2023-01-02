import { ChangeDetectorRef, RendererFactory2 } from '@angular/core';
import { NgtStore } from '../stores/store';
import { NgtRendererFactory2 } from './renderer-two';

export type NgtRenderer2ProviderOptions = {
  store: NgtStore;
  changeDetectorRef: ChangeDetectorRef;
  compoundPrefixes?: string[];
};

export function provideNgtRenderer2({
  store,
  changeDetectorRef,
  compoundPrefixes,
}: NgtRenderer2ProviderOptions) {
  if (!compoundPrefixes) {
    compoundPrefixes = [];
  }

  if (!compoundPrefixes.includes('ngts')) {
    compoundPrefixes.push('ngts');
  }

  return [
    { provide: RendererFactory2, useClass: NgtRendererFactory2 },
    { provide: NgtStore, useValue: store },
    { provide: ChangeDetectorRef, useValue: changeDetectorRef },
    provideNgtCompoundPrefixes(compoundPrefixes),
  ];
}
