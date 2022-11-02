import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, provideNgtObject } from '../abstracts/object';
import type { AnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonHelper<
  THelper extends THREE.Object3D = THREE.Object3D
> extends NgtObject<THelper> {
  abstract get helperType(): AnyConstructor<THelper>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<THelper>>) {
    this.instanceArgs = v;
  }

  override instanceInitFn(): THelper {
    return new this.helperType(...this.get((s) => s.instanceArgs));
  }
}

export const provideNgtCommonHelper = createNgtProvider(
  NgtCommonHelper,
  provideNgtObject
);
