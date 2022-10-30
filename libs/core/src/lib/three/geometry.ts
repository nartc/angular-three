import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtInstance,
  NgtInstanceState,
  provideNgtInstance,
} from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/object';
import { AnyConstructor, NgtInstanceNode } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtInstance<TGeometry, NgtInstanceState<TGeometry>> {
  abstract get geometryType(): AnyConstructor<TGeometry>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TGeometry>>) {
    this.instanceArgs = v;
  }

  protected override parentRef = injectObjectRef({
    optional: true,
    skipSelf: true,
  });

  protected override parentHostRef = injectObjectHostRef({
    optional: true,
    skipSelf: true,
  });

  protected override preInit = () => {
    this.set((s) => ({
      attach: s.attach.length ? s.attach : ['geometry'],
    }));
  };

  protected override initFn(
    prepareInstance: (
      instance: TGeometry,
      uuid?: string
    ) => NgtInstanceNode<TGeometry>
  ): (() => void) | void | undefined {
    const geometry = prepareInstance(this.instanceInitFn());

    return () => {
      geometry.dispose();
    };
  }

  protected override instanceInitFn(): TGeometry {
    const instanceArgs = this.get((s) => s.instanceArgs);
    const geometryArgs = this.initInstanceArgs(instanceArgs);
    return new this.geometryType(...geometryArgs);
  }
}

export const provideNgtCommonGeometry = createNgtProvider(
  NgtCommonGeometry,
  provideNgtInstance
);
