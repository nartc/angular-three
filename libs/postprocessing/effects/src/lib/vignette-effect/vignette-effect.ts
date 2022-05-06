// GENERATED
import {
  AnyConstructor,
  coerceBooleanProperty,
  BooleanInput,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { VignetteEffect, VignetteTechnique } from 'postprocessing';

@Component({
  selector: 'ngt-vignette-effect',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtVignetteEffect)],
})
export class NgtVignetteEffect extends NgtCommonEffect<VignetteEffect> {
  override get effectType(): AnyConstructor<VignetteEffect> {
    return VignetteEffect;
  }

  @Input() set technique(technique: VignetteTechnique) {
    this.set({ technique });
  }

  @Input() set eskil(eskil: BooleanInput) {
    this.set({ eskil: coerceBooleanProperty(eskil) });
  }

  @Input() set offset(offset: NumberInput) {
    this.set({ offset: coerceNumberProperty(offset) });
  }

  @Input() set darkness(darkness: NumberInput) {
    this.set({ darkness: coerceNumberProperty(darkness) });
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      technique: true,
      eskil: true,
      offset: true,
      darkness: true,
    };
  }
}

@NgModule({
  declarations: [NgtVignetteEffect],
  exports: [NgtVignetteEffect],
})
export class NgtVignetteEffectModule {}
