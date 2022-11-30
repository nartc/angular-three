// GENERATED - AngularThree v7.0.0
import { coerceNumber, NgtAnyConstructor, NgtNumberInput, NgtObservableInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { BlendFunction, KernelSize, TiltShiftEffect } from 'postprocessing';
import { isObservable, map } from 'rxjs';

@Directive({
  selector: 'ngt-tilt-shift-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtTiltShiftEffect), provideCommonEffectRef(NgtTiltShiftEffect)],
})
export class NgtTiltShiftEffect extends NgtCommonEffect<TiltShiftEffect> {
  override get effectType(): NgtAnyConstructor<TiltShiftEffect> {
    return TiltShiftEffect;
  }

  @Input() set offset(offset: NgtObservableInput<NgtNumberInput>) {
    this.set({ offset: isObservable(offset) ? offset.pipe(map(coerceNumber)) : coerceNumber(offset) });
  }

  @Input() set rotation(rotation: NgtObservableInput<NgtNumberInput>) {
    this.set({ rotation: isObservable(rotation) ? rotation.pipe(map(coerceNumber)) : coerceNumber(rotation) });
  }

  @Input() set focusArea(focusArea: NgtObservableInput<NgtNumberInput>) {
    this.set({ focusArea: isObservable(focusArea) ? focusArea.pipe(map(coerceNumber)) : coerceNumber(focusArea) });
  }

  @Input() set feather(feather: NgtObservableInput<NgtNumberInput>) {
    this.set({ feather: isObservable(feather) ? feather.pipe(map(coerceNumber)) : coerceNumber(feather) });
  }

  @Input() set bias(bias: NgtObservableInput<NgtNumberInput>) {
    this.set({ bias: isObservable(bias) ? bias.pipe(map(coerceNumber)) : coerceNumber(bias) });
  }

  @Input() set kernelSize(kernelSize: NgtObservableInput<KernelSize>) {
    this.set({ kernelSize });
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

  override get defaultBlendMode(): BlendFunction {
    return BlendFunction.ADD;
  }

  override get effectPropFields(): string[] {
    return [
      ...super.effectPropFields,
      'offset',
      'rotation',
      'focusArea',
      'feather',
      'bias',
      'kernelSize',
      'resolutionScale',
      'resolutionX',
      'resolutionY',
    ];
  }
}
