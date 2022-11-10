import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtInstance,
  NgtInstanceState,
  provideNgtInstance,
} from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/object';
import { AnyConstructor, NgtPrepareInstanceFn } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtInstance<TGeometry, NgtInstanceState<TGeometry>> {
  abstract get geometryType(): AnyConstructor<TGeometry>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TGeometry>>) {
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

  override preInit() {
    this.set((s) => ({
      attach: s.attach.length ? s.attach : ['geometry'],
    }));
  }

  override initFn(
    prepareInstance: NgtPrepareInstanceFn<TGeometry>
  ): (() => void) | void | undefined {
    const instanceArgs = this.get((s) => s.instanceArgs);
    const geometryArgs = this.initInstanceArgs(instanceArgs);
    const geometry = prepareInstance(new this.geometryType(...geometryArgs));

    return () => {
      geometry.dispose();
    };
  }
}

export const provideNgtCommonGeometry = createNgtProvider(
  NgtCommonGeometry,
  provideNgtInstance
);
