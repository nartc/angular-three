import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, provideNgtObject } from '../abstracts/object';
import type { NgtAnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonHelper<THelper extends THREE.Object3D = THREE.Object3D> extends NgtObject<THelper> {
  abstract get helperType(): NgtAnyConstructor<THelper>;

  @Input() set args(v: ConstructorParameters<NgtAnyConstructor<THelper>>) {
    this.instanceArgs = v;
  }

  override instanceInitFn(): THelper {
    return new this.helperType(...this.initInstanceArgs(this.instanceArgs));
  }
}

export const provideNgtCommonHelper = createNgtProvider(NgtCommonHelper, provideNgtObject);
