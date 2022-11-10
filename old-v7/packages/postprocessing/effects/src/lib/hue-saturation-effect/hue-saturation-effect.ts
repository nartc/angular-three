// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtObservableInput, coerceNumber, NgtNumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { HueSaturationEffect } from 'postprocessing';

@Directive({
  selector: 'ngt-hue-saturation-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtHueSaturationEffect), provideCommonEffectRef(NgtHueSaturationEffect)],
})
export class NgtHueSaturationEffect extends NgtCommonEffect<HueSaturationEffect> {
  override get effectType(): NgtAnyConstructor<HueSaturationEffect> {
    return HueSaturationEffect;
  }

  @Input() set hue(hue: NgtObservableInput<NgtNumberInput>) {
    this.set({ hue: isObservable(hue) ? hue.pipe(map(coerceNumber)) : coerceNumber(hue) });
  }

  @Input() set saturation(saturation: NgtObservableInput<NgtNumberInput>) {
    this.set({ saturation: isObservable(saturation) ? saturation.pipe(map(coerceNumber)) : coerceNumber(saturation) });
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'hue', 'saturation'];
  }
}
