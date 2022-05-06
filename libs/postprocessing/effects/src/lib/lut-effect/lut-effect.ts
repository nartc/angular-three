import {
  AnyConstructor,
  BooleanInput,
  coerceBooleanProperty,
  startWithUndefined,
  UnknownRecord,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { LUTEffect } from 'postprocessing';
import * as THREE from 'three';

@Component({
  selector: 'ngt-lut-effect',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtLUTEffect)],
})
export class NgtLUTEffect extends NgtCommonEffect<LUTEffect> {
  @Input() set lut(lut: THREE.Texture) {
    this.set({ lut });
  }

  @Input() set tetrahedralInterpolation(tetrahedralInterpolation: BooleanInput) {
    this.set({ tetrahedralInterpolation: coerceBooleanProperty(tetrahedralInterpolation) });
  }

  override get effectType(): AnyConstructor<LUTEffect> {
    return LUTEffect;
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return { ...super.effectOptionsFields, tetrahedralInterpolation: true };
  }

  protected override adjustCtorParams(instanceArgs: unknown[]): unknown[] {
    return [this.get((s) => s['lut']), instanceArgs[0] as UnknownRecord];
  }

  protected override get ctorParams$() {
    return this.select(this.select((s) => s['lut']).pipe(startWithUndefined()));
  }
}

@NgModule({
  declarations: [NgtLUTEffect],
  exports: [NgtLUTEffect],
})
export class NgtLUTEffectModule {}
