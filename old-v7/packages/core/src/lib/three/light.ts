import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, provideNgtObject } from '../abstracts/object';
import { NgtObjectInputsState } from '../abstracts/object-inputs';
import type { NgtAnyConstructor, NgtNumberInput } from '../types';
import { coerceNumber } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

export interface NgtCommonLightState<TLight extends THREE.Light = THREE.Light> extends NgtObjectInputsState<TLight> {
  intensity: number;
}

@Directive()
export abstract class NgtCommonLight<TLight extends THREE.Light = THREE.Light> extends NgtObject<
  TLight,
  NgtCommonLightState<TLight>
> {
  abstract get lightType(): NgtAnyConstructor<TLight>;

  @Input() set args(v: ConstructorParameters<NgtAnyConstructor<TLight>>) {
    this.instanceArgs = v;
  }

  @Input() set intensity(intensity: NgtNumberInput) {
    this.set({ intensity: coerceNumber(intensity) });
  }

  override initialize() {
    super.initialize();
    this.set({ intensity: 1 });
  }

  override instanceInitFn(): TLight {
    const intensity = this.getState((s) => s.intensity);

    const light = new this.lightType(...this.initInstanceArgs(this.instanceArgs));
    light.intensity = intensity;

    return light;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'intensity'];
  }
}

export const provideNgtCommonLight = createNgtProvider(NgtCommonLight, provideNgtObject);
