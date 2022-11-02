import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtObject,
  NgtObjectInputsState,
  provideNgtObject,
} from '../abstracts/object';
import type { AnyConstructor, NumberInput } from '../types';
import { coerceNumberProperty } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

export interface NgtCommonLightState<TLight extends THREE.Light = THREE.Light>
  extends NgtObjectInputsState<TLight> {
  intensity: number;
}

@Directive()
export abstract class NgtCommonLight<
  TLight extends THREE.Light = THREE.Light
> extends NgtObject<TLight, NgtCommonLightState<TLight>> {
  abstract get lightType(): AnyConstructor<TLight>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TLight>>) {
    this.instanceArgs = v;
  }

  @Input() set intensity(intensity: NumberInput) {
    this.set({ intensity: coerceNumberProperty(intensity) });
  }

  override preInit() {
    super.preInit();
    this.set((s) => ({ intensity: s.intensity ?? 1 }));
  }

  override instanceInitFn = (): TLight => {
    const { intensity, instanceArgs } = this.get();

    const light = new this.lightType(...instanceArgs);

    if (intensity != undefined) {
      light.intensity = intensity;
    }

    return light;
  };

  protected override get optionsFields(): Record<string, boolean> {
    return { ...super.optionsFields, intensity: false };
  }
}

export const provideNgtCommonLight = createNgtProvider(
  NgtCommonLight,
  provideNgtObject
);
