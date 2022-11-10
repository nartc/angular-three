// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtObservableInput, coerceNumber, NgtNumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { BlendFunction, ScanlineEffect } from 'postprocessing';

@Directive({
  selector: 'ngt-scanline-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtScanlineEffect), provideCommonEffectRef(NgtScanlineEffect)],
})
export class NgtScanlineEffect extends NgtCommonEffect<ScanlineEffect> {
  override get effectType(): NgtAnyConstructor<ScanlineEffect> {
    return ScanlineEffect;
  }

  @Input() set density(density: NgtObservableInput<NgtNumberInput>) {
    this.set({ density: isObservable(density) ? density.pipe(map(coerceNumber)) : coerceNumber(density) });
  }

  override get defaultBlendMode(): BlendFunction {
    return BlendFunction.OVERLAY;
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'density'];
  }
}
