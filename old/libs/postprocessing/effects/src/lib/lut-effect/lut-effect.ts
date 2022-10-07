import {
  AnyConstructor,
  BooleanInput,
  coerceBooleanProperty,
  startWithUndefined,
  UnknownRecord,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { LUT3DEffect } from 'postprocessing';
import { tap } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-lut-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonEffect(NgtLUTEffect), provideCommonEffectRef(NgtLUTEffect)],
})
export class NgtLUTEffect extends NgtCommonEffect<LUT3DEffect> {
  @Input() set lut(lut: THREE.Texture) {
    this.set({ lut });
  }

  @Input() set tetrahedralInterpolation(tetrahedralInterpolation: BooleanInput) {
    this.set({ tetrahedralInterpolation: coerceBooleanProperty(tetrahedralInterpolation) });
  }

  override get effectType(): AnyConstructor<LUT3DEffect> {
    return LUT3DEffect;
  }

  protected override get skipConfigureBlendMode(): boolean {
    return true;
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return { ...super.effectOptionsFields, lut: false, tetrahedralInterpolation: true };
  }

  protected override adjustCtorParams(instanceArgs: unknown[]): unknown[] {
    const { lut, ...rest } = instanceArgs[0] as UnknownRecord;
    return [lut, rest];
  }

  protected override postInit() {
    super.postInit();
    this.setLut(
      this.select(
        this.instance$,
        this.select((s) => s['lut']),
        this.select((s) => s['tetrahedralInterpolation']).pipe(startWithUndefined())
      )
    );
  }

  private readonly setLut = this.effect(
    tap(() => {
      const invalidate = this.store.get((s) => s.invalidate);
      const { lut, tetrahedralInterpolation } = this.get();
      if (lut) {
        this.instanceValue.lut = lut;
      }
      if (tetrahedralInterpolation) {
        this.instanceValue.tetrahedralInterpolation = tetrahedralInterpolation;
      }
      invalidate();
    })
  );
}

@NgModule({
  imports: [NgtLUTEffect],
  exports: [NgtLUTEffect],
})
export class NgtLUTEffectModule {}
