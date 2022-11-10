import {
  coerceBoolean,
  coerceNumber,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObservableInput,
  NgtUnknownRecord,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { BlendFunction, SSAOEffect } from 'postprocessing';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-ssao-effect',
  standalone: true,
  providers: [provideCommonEffectRef(NgtSSAOEffect), provideNgtCommonEffect(NgtSSAOEffect)],
})
export class NgtSSAOEffect extends NgtCommonEffect<SSAOEffect> {
  override get effectType(): NgtAnyConstructor<SSAOEffect> {
    return SSAOEffect;
  }

  @Input() set distanceScaling(distanceScaling: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      distanceScaling: isObservable(distanceScaling)
        ? distanceScaling.pipe(map(coerceBoolean))
        : coerceBoolean(distanceScaling),
    });
  }

  @Input() set depthAwareUpsampling(depthAwareUpsampling: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      depthAwareUpsampling: isObservable(depthAwareUpsampling)
        ? depthAwareUpsampling.pipe(map(coerceBoolean))
        : coerceBoolean(depthAwareUpsampling),
    });
  }

  @Input() set normalDepthBuffer(normalDepthBuffer: NgtObservableInput<THREE.Texture>) {
    this.set({ normalDepthBuffer });
  }

  @Input() set samples(samples: NgtObservableInput<NgtNumberInput>) {
    this.set({ samples: isObservable(samples) ? samples.pipe(map(coerceNumber)) : coerceNumber(samples) });
  }

  @Input() set rings(rings: NgtObservableInput<NgtNumberInput>) {
    this.set({ rings: isObservable(rings) ? rings.pipe(map(coerceNumber)) : coerceNumber(rings) });
  }

  @Input() set worldDistanceThreshold(worldDistanceThreshold: NgtObservableInput<NgtNumberInput>) {
    this.set({
      worldDistanceThreshold: isObservable(worldDistanceThreshold)
        ? worldDistanceThreshold.pipe(map(coerceNumber))
        : coerceNumber(worldDistanceThreshold),
    });
  }

  @Input() set worldDistanceFalloff(worldDistanceFalloff: NgtObservableInput<NgtNumberInput>) {
    this.set({
      worldDistanceFalloff: isObservable(worldDistanceFalloff)
        ? worldDistanceFalloff.pipe(map(coerceNumber))
        : coerceNumber(worldDistanceFalloff),
    });
  }

  @Input() set worldProximityThreshold(worldProximityThreshold: NgtObservableInput<NgtNumberInput>) {
    this.set({
      worldProximityThreshold: isObservable(worldProximityThreshold)
        ? worldProximityThreshold.pipe(map(coerceNumber))
        : coerceNumber(worldProximityThreshold),
    });
  }

  @Input() set worldProximityFalloff(worldProximityFalloff: NgtObservableInput<NgtNumberInput>) {
    this.set({
      worldProximityFalloff: isObservable(worldProximityFalloff)
        ? worldProximityFalloff.pipe(map(coerceNumber))
        : coerceNumber(worldProximityFalloff),
    });
  }

  @Input() set distanceThreshold(distanceThreshold: NgtObservableInput<NgtNumberInput>) {
    this.set({
      distanceThreshold: isObservable(distanceThreshold)
        ? distanceThreshold.pipe(map(coerceNumber))
        : coerceNumber(distanceThreshold),
    });
  }

  @Input() set distanceFalloff(distanceFalloff: NgtObservableInput<NgtNumberInput>) {
    this.set({
      distanceFalloff: isObservable(distanceFalloff)
        ? distanceFalloff.pipe(map(coerceNumber))
        : coerceNumber(distanceFalloff),
    });
  }

  @Input() set rangeThreshold(rangeThreshold: NgtObservableInput<NgtNumberInput>) {
    this.set({
      rangeThreshold: isObservable(rangeThreshold)
        ? rangeThreshold.pipe(map(coerceNumber))
        : coerceNumber(rangeThreshold),
    });
  }

  @Input() set rangeFalloff(rangeFalloff: NgtObservableInput<NgtNumberInput>) {
    this.set({
      rangeFalloff: isObservable(rangeFalloff) ? rangeFalloff.pipe(map(coerceNumber)) : coerceNumber(rangeFalloff),
    });
  }

  @Input() set minRadiusScale(minRadiusScale: NgtObservableInput<NgtNumberInput>) {
    this.set({
      minRadiusScale: isObservable(minRadiusScale)
        ? minRadiusScale.pipe(map(coerceNumber))
        : coerceNumber(minRadiusScale),
    });
  }

  @Input() set luminanceInfluence(luminanceInfluence: NgtObservableInput<NgtNumberInput>) {
    this.set({
      luminanceInfluence: isObservable(luminanceInfluence)
        ? luminanceInfluence.pipe(map(coerceNumber))
        : coerceNumber(luminanceInfluence),
    });
  }

  @Input() set radius(radius: NgtObservableInput<NgtNumberInput>) {
    this.set({ radius: isObservable(radius) ? radius.pipe(map(coerceNumber)) : coerceNumber(radius) });
  }

  @Input() set intensity(intensity: NgtObservableInput<NgtNumberInput>) {
    this.set({ intensity: isObservable(intensity) ? intensity.pipe(map(coerceNumber)) : coerceNumber(intensity) });
  }

  @Input() set bias(bias: NgtObservableInput<NgtNumberInput>) {
    this.set({ bias: isObservable(bias) ? bias.pipe(map(coerceNumber)) : coerceNumber(bias) });
  }

  @Input() set fade(fade: NgtObservableInput<NgtNumberInput>) {
    this.set({ fade: isObservable(fade) ? fade.pipe(map(coerceNumber)) : coerceNumber(fade) });
  }

  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set resolutionScale(resolutionScale: NgtObservableInput<NgtNumberInput>) {
    this.set({
      resolutionScale: isObservable(resolutionScale)
        ? resolutionScale.pipe(map(coerceNumber))
        : coerceNumber(resolutionScale),
    });
  }

  @Input() set resolutionX(resolutionX: NgtObservableInput<NgtNumberInput>) {
    this.set({
      resolutionX: isObservable(resolutionX) ? resolutionX.pipe(map(coerceNumber)) : coerceNumber(resolutionX),
    });
  }

  @Input() set resolutionY(resolutionY: NgtObservableInput<NgtNumberInput>) {
    this.set({
      resolutionY: isObservable(resolutionY) ? resolutionY.pipe(map(coerceNumber)) : coerceNumber(resolutionY),
    });
  }

  @Input() set width(width: NgtObservableInput<NgtNumberInput>) {
    this.set({ width: isObservable(width) ? width.pipe(map(coerceNumber)) : coerceNumber(width) });
  }

  @Input() set height(height: NgtObservableInput<NgtNumberInput>) {
    this.set({ height: isObservable(height) ? height.pipe(map(coerceNumber)) : coerceNumber(height) });
  }

  override get defaultBlendMode(): BlendFunction {
    return BlendFunction.MULTIPLY;
  }

  override initEffectArgs(): unknown[] {
    const [props] = super.initEffectArgs() as [NgtUnknownRecord];
    const { normalPass, camera, downSamplingPass, resolutionScale } = this.effectComposer.getState();
    if (normalPass === null) {
      console.error('Please enable the NormalPass in the EffectComposer in order to use SSAO.');
      return [];
    }

    Object.keys(props).forEach((key) => {
      if (props[key] === undefined) {
        delete props[key];
      }
    });

    return [
      camera,
      normalPass && !downSamplingPass ? normalPass.texture : null,
      {
        blendFunction: this.defaultBlendMode,
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
        normalDepthBuffer: downSamplingPass ? downSamplingPass.texture : null,
        resolutionScale: resolutionScale ?? 1,
        depthAwareUpsampling: true,
        ...props,
      },
    ];
  }

  override get extraEffectArgs(): Array<{ name: string; fromComposer?: boolean }> {
    return [
      ...super.extraEffectArgs,
      { name: 'camera', fromComposer: true },
      { name: 'normalPass', fromComposer: true },
    ];
  }

  override get effectPropFields(): string[] {
    return [
      ...super.effectPropFields,
      'distanceScaling',
      'depthAwareUpsampling',
      'normalDepthBuffer',
      'samples',
      'rings',
      'worldDistanceThreshold',
      'worldDistanceFalloff',
      'worldProximityThreshold',
      'worldProximityFalloff',
      'distanceThreshold',
      'distanceFalloff',
      'rangeThreshold',
      'rangeFalloff',
      'minRadiusScale',
      'luminanceInfluence',
      'radius',
      'intensity',
      'bias',
      'fade',
      'color',
      'resolutionScale',
      'resolutionX',
      'resolutionY',
      'width',
      'height',
    ];
  }
}
