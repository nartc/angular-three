import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, provideNgtObject } from '../abstracts/object';
import type { NgtAnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonCamera<TCamera extends THREE.Camera = THREE.Camera> extends NgtObject<TCamera> {
  abstract get cameraType(): NgtAnyConstructor<TCamera>;

  @Input() set args(v: ConstructorParameters<NgtAnyConstructor<TCamera>>) {
    this.instanceArgs = v;
  }

  override instanceInitFn(): TCamera {
    return new this.cameraType(...this.initInstanceArgs(this.instanceArgs));
  }
}

export const provideNgtCommonCamera = createNgtProvider(NgtCommonCamera, provideNgtObject);
