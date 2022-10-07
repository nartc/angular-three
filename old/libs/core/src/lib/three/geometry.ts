import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import type { NgtInstanceState } from '../abstracts/instance';
import { NgtInstance, provideNgtInstance } from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/object';
import { tapEffect } from '../stores/component-store';
import type { AnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtInstance<TGeometry, NgtInstanceState<TGeometry>> {
  abstract get geometryType(): AnyConstructor<TGeometry>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TGeometry>>) {
    this.instanceArgs = v;
  }

  protected override parentRef = injectObjectRef({ optional: true, skipSelf: true });
  protected override parentHostRef = injectObjectHostRef({ optional: true, skipSelf: true });

  protected override preInit() {
    this.set((state) => ({
      attach: state.attach.length ? state.attach : ['geometry'],
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.init(this.ctorParams$);
        this.postInit();
      });
    });
  }

  private readonly init = this.effect(
    tapEffect(() => {
      const instanceArgs = this.get((s) => s.instanceArgs);
      const geometryArgs = this.adjustCtorParams(instanceArgs);
      const geometry = this.prepareInstance(new this.geometryType(...geometryArgs));

      return () => {
        geometry.dispose();
      };
    })
  );
}

export const provideNgtCommonGeometry = createNgtProvider(NgtCommonGeometry, provideNgtInstance);
