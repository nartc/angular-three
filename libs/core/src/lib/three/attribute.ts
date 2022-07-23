import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from '../abstracts/instance';
import { tapEffect } from '../stores/component-store';
import type { AnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonAttribute<
  TAttribute extends THREE.BufferAttribute | THREE.InterleavedBufferAttribute = THREE.BufferAttribute
> extends NgtInstance<TAttribute, NgtInstanceState<TAttribute>> {
  abstract get attributeType(): AnyConstructor<TAttribute>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TAttribute>>) {
    this.instanceArgs = v;
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        const initSub = this.init(this.instanceArgs$);
        this.postInit();
        return () => {
          if (initSub && initSub.unsubscribe) {
            initSub.unsubscribe();
          }
        };
      });
    });
  }

  private readonly init = this.effect<unknown[]>(
    tapEffect((instanceArgs) => {
      this.prepareInstance(new this.attributeType(...instanceArgs));
    })
  );
}

export const provideNgtCommonAttribute = createNgtProvider(NgtCommonAttribute, provideNgtInstance);
