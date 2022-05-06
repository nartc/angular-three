import {
  AnyConstructor,
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
  UnknownRecord,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { SSAOEffect } from 'postprocessing';
import * as THREE from 'three';
import { Color } from 'three';

@Component({
  selector: 'ngt-ssao-effect',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtSSAOEffect)],
})
export class NgtSSAOEffect extends NgtCommonEffect<SSAOEffect> {
  @Input() set distanceScaling(distanceScaling: BooleanInput) {
    this.set({ distanceScaling: coerceBooleanProperty(distanceScaling) });
  }

  @Input() set depthAwareUpsampling(depthAwareUpsampling: BooleanInput) {
    this.set({ depthAwareUpsampling: coerceBooleanProperty(depthAwareUpsampling) });
  }

  @Input() set normalDepthBuffer(normalDepthBuffer: THREE.Texture) {
    this.set({ normalDepthBuffer });
  }

  @Input() set samples(samples: NumberInput) {
    this.set({ samples: coerceNumberProperty(samples) });
  }

  @Input() set rings(rings: NumberInput) {
    this.set({ rings: coerceNumberProperty(rings) });
  }

  @Input() set worldDistanceThreshold(worldDistanceThreshold: NumberInput) {
    this.set({ worldDistanceThreshold: coerceNumberProperty(worldDistanceThreshold) });
  }

  @Input() set worldDistanceFalloff(worldDistanceFalloff: NumberInput) {
    this.set({ worldDistanceFalloff: coerceNumberProperty(worldDistanceFalloff) });
  }

  @Input() set worldProximityThreshold(worldProximityThreshold: NumberInput) {
    this.set({ worldProximityThreshold: coerceNumberProperty(worldProximityThreshold) });
  }

  @Input() set worldProximityFalloff(worldProximityFalloff: NumberInput) {
    this.set({ worldProximityFalloff: coerceNumberProperty(worldProximityFalloff) });
  }

  @Input() set distanceThreshold(distanceThreshold: NumberInput) {
    this.set({ distanceThreshold: coerceNumberProperty(distanceThreshold) });
  }

  @Input() set distanceFalloff(distanceFalloff: NumberInput) {
    this.set({ distanceFalloff: coerceNumberProperty(distanceFalloff) });
  }

  @Input() set rangeThreshold(rangeThreshold: NumberInput) {
    this.set({ rangeThreshold: coerceNumberProperty(rangeThreshold) });
  }

  @Input() set rangeFalloff(rangeFalloff: NumberInput) {
    this.set({ rangeFalloff: coerceNumberProperty(rangeFalloff) });
  }

  @Input() set minRadiusScale(minRadiusScale: NumberInput) {
    this.set({ minRadiusScale: coerceNumberProperty(minRadiusScale) });
  }

  @Input() set luminanceInfluence(luminanceInfluence: NumberInput) {
    this.set({ luminanceInfluence: coerceNumberProperty(luminanceInfluence) });
  }

  @Input() set radius(radius: NumberInput) {
    this.set({ radius: coerceNumberProperty(radius) });
  }

  @Input() set intensity(intensity: NumberInput) {
    this.set({ intensity: coerceNumberProperty(intensity) });
  }

  @Input() set bias(bias: NumberInput) {
    this.set({ bias: coerceNumberProperty(bias) });
  }

  @Input() set fade(fade: NumberInput) {
    this.set({ fade: coerceNumberProperty(fade) });
  }

  @Input() set color(color: Color) {
    this.set({ color });
  }

  @Input() set resolutionScale(resolutionScale: NumberInput) {
    this.set({ resolutionScale: coerceNumberProperty(resolutionScale) });
  }

  @Input() set width(width: NumberInput) {
    this.set({ width: coerceNumberProperty(width) });
  }

  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  override get effectType(): AnyConstructor<SSAOEffect> {
    return SSAOEffect;
  }

  protected override get skipConfigureBlendMode(): boolean {
    return true;
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      distanceScaling: true,
      depthAwareUpsampling: true,
      normalDepthBuffer: true,
      samples: true,
      rings: true,
      worldDistanceThreshold: true,
      worldDistanceFalloff: true,
      worldProximityThreshold: true,
      worldProximityFalloff: true,
      distanceThreshold: true,
      distanceFalloff: true,
      rangeThreshold: true,
      rangeFalloff: true,
      minRadiusScale: true,
      luminanceInfluence: true,
      radius: true,
      intensity: true,
      bias: true,
      fade: true,
      color: true,
      resolutionScale: true,
      width: true,
      height: true,
    };
  }

  protected override adjustCtorParams(instanceArgs: unknown[]): unknown[] {
    const { camera, normalPass, depthDownSamplingPass, resolutionScale } = this.effectComposer.get();
    if (normalPass === null && depthDownSamplingPass === null) {
      throw new Error(`SSAO can only be used when normalPass is enabled`);
    }

    const options = Object.entries(instanceArgs[0] as UnknownRecord).reduce((result, [key, value]) => {
      if (value !== undefined) {
        result[key] = value;
      }
      return result;
    }, {} as UnknownRecord);
    return [
      camera,
      normalPass && !depthDownSamplingPass ? normalPass.texture : null,
      {
        blendFunction: this.get((s) => s['blendFunction']),
        samples: 30,
        rings: 4,
        distanceThreshold: 1.0,
        distanceFalloff: 0.0,
        rangeThreshold: 0.5,
        rangeFalloff: 0.1,
        luminanceInfluence: 0.9,
        radius: 20,
        scale: 0.5,
        bias: 0.5,
        intensity: 1.0,
        color: null,
        normalDepthBuffer: depthDownSamplingPass ? depthDownSamplingPass.texture : null,
        resolutionScale: resolutionScale ?? 1,
        depthAwareUpsampling: true,
        ...options,
      },
    ];
  }

  protected override get ctorParams$() {
    return this.select(
      this.effectComposer.select((s) => s.camera),
      this.effectComposer.select((s) => s.normalPass)
    );
  }
}

@NgModule({
  declarations: [NgtSSAOEffect],
  exports: [NgtSSAOEffect],
})
export class NgtSSAOEffectModule {}
