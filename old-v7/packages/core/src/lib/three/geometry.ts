import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/three';
import { NgtAnyConstructor, NgtPrepareInstanceFn } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtInstance<TGeometry, NgtInstanceState<TGeometry>> {
  abstract get geometryType(): NgtAnyConstructor<TGeometry>;

  @Input() set args(v: ConstructorParameters<NgtAnyConstructor<TGeometry>>) {
    this.instanceArgs = v;
  }

  override parentRef = injectObjectRef({
    optional: true,
    skipSelf: true,
  });

  override parentHostRef = injectObjectHostRef({
    optional: true,
    skipSelf: true,
  });

  override initialize() {
    super.initialize();
    this.set({ attach: ['geometry'] });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<TGeometry>): (() => void) | void | undefined {
    const geometry = prepareInstance(new this.geometryType(...this.initInstanceArgs(this.instanceArgs)));

    return () => {
      geometry.dispose();
    };
  }
}

export const provideNgtCommonGeometry = createNgtProvider(NgtCommonGeometry, provideNgtInstance);
