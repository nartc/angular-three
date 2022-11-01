import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, provideNgtObject } from '../abstracts/object';
import type { AnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonCamera<
  TCamera extends THREE.Camera = THREE.Camera
> extends NgtObject<TCamera> {
  abstract get cameraType(): AnyConstructor<TCamera>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TCamera>>) {
    this.instanceArgs = v;
  }

  protected override instanceInitFn = (): TCamera => {
    const instanceArgs = this.get((s) => s.instanceArgs);
    return new this.cameraType(...instanceArgs);
  };
}

export const provideNgtCommonCamera = createNgtProvider(
  NgtCommonCamera,
  provideNgtObject
);
