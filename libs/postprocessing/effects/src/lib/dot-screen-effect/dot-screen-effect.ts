// GENERATED
import { AnyConstructor, coerceNumberProperty, NumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideNgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { DotScreenEffect } from 'postprocessing';

@Component({
  selector: 'ngt-dot-screen-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonEffect(NgtDotScreenEffect), provideCommonEffectRef(NgtDotScreenEffect)],
})
export class NgtDotScreenEffect extends NgtCommonEffect<DotScreenEffect> {
  override get effectType(): AnyConstructor<DotScreenEffect> {
    return DotScreenEffect;
  }

  @Input() set angle(angle: NumberInput) {
    this.set({ angle: coerceNumberProperty(angle) });
  }

  @Input() set scale(scale: NumberInput) {
    this.set({ scale: coerceNumberProperty(scale) });
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      angle: true,
      scale: true,
    };
  }
}

@NgModule({
  imports: [NgtDotScreenEffect],
  exports: [NgtDotScreenEffect],
})
export class NgtDotScreenEffectModule {}
