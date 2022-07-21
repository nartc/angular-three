// GENERATED
import { AnyConstructor, coerceBooleanProperty, BooleanInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { DepthEffect } from 'postprocessing';

@Component({
  selector: 'ngt-depth-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtDepthEffect)],
})
export class NgtDepthEffect extends NgtCommonEffect<DepthEffect> {
  override get effectType(): AnyConstructor<DepthEffect> {
    return DepthEffect;
  }

  @Input() set inverted(inverted: BooleanInput) {
    this.set({ inverted: coerceBooleanProperty(inverted) });
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      inverted: true,
    };
  }
}

@NgModule({
  imports: [NgtDepthEffect],
  exports: [NgtDepthEffect],
})
export class NgtDepthEffectModule {}
