import { Directive, Input } from '@angular/core';
import * as THREE from 'three/src/Three';
import type { NgtObjectInputsState, NgtPreObjectInit } from '../abstracts/object';
import { NgtObject } from '../abstracts/object';
import type { AnyConstructor, NumberInput } from '../types';
import { coerceNumberProperty } from '../utils/coercion';

export interface NgtCommonLightState<TLight extends THREE.Light = THREE.Light> extends NgtObjectInputsState<TLight> {
  intensity: number;
}

@Directive()
export abstract class NgtCommonLight<TLight extends THREE.Light = THREE.Light> extends NgtObject<
  TLight,
  NgtCommonLightState<TLight>
> {
  abstract get lightType(): AnyConstructor<TLight>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TLight>>) {
    this.instanceArgs = v;
  }

  @Input() set intensity(intensity: NumberInput) {
    this.set({ intensity: coerceNumberProperty(intensity) });
  }

  protected override objectInitFn(): TLight {
    const { intensity, instanceArgs } = this.get();

    const light = new this.lightType(...instanceArgs);

    if (intensity != undefined) {
      light.intensity = intensity;
    }

    return light;
  }

  protected override get preObjectInit(): NgtPreObjectInit {
    return (initFn) => {
      this.set((state) => ({ intensity: state.intensity ?? 1 }));
      initFn();
    };
  }

  protected override get optionFields(): Record<string, boolean> {
    return { ...super.optionFields, intensity: false };
  }
}
