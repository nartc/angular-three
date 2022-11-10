// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtObservableInput,
  coerceBoolean,
  NgtBooleanInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { BlendFunction, BloomEffect, KernelSize } from 'postprocessing';

@Directive({
  selector: 'ngt-bloom-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtBloomEffect), provideCommonEffectRef(NgtBloomEffect)],
})
export class NgtBloomEffect extends NgtCommonEffect<BloomEffect> {
  override get effectType(): NgtAnyConstructor<BloomEffect> {
    return BloomEffect;
  }

  @Input() set mipmapBlur(mipmapBlur: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      mipmapBlur: isObservable(mipmapBlur) ? mipmapBlur.pipe(map(coerceBoolean)) : coerceBoolean(mipmapBlur),
    });
  }

  @Input() set luminanceThreshold(luminanceThreshold: NgtObservableInput<NgtNumberInput>) {
    this.set({
      luminanceThreshold: isObservable(luminanceThreshold)
        ? luminanceThreshold.pipe(map(coerceNumber))
        : coerceNumber(luminanceThreshold),
    });
  }

  @Input() set luminanceSmoothing(luminanceSmoothing: NgtObservableInput<NgtNumberInput>) {
    this.set({
      luminanceSmoothing: isObservable(luminanceSmoothing)
        ? luminanceSmoothing.pipe(map(coerceNumber))
        : coerceNumber(luminanceSmoothing),
    });
  }

  @Input() set intensity(intensity: NgtObservableInput<NgtNumberInput>) {
    this.set({ intensity: isObservable(intensity) ? intensity.pipe(map(coerceNumber)) : coerceNumber(intensity) });
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

  @Input() set kernelSize(kernelSize: NgtObservableInput<KernelSize>) {
    this.set({ kernelSize });
  }

  override get defaultBlendMode(): BlendFunction {
    return BlendFunction.ADD;
  }

  override get effectPropFields(): string[] {
    return [
      ...super.effectPropFields,
      'mipmapBlur',
      'luminanceThreshold',
      'luminanceSmoothing',
      'intensity',
      'resolutionScale',
      'resolutionX',
      'resolutionY',
      'width',
      'height',
      'kernelSize',
    ];
  }
}
