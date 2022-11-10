import {
  coerceBoolean,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtObservableInput,
  NgtUnknownRecord,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { LUT3DEffect } from 'postprocessing';
import { filter, isObservable, map, tap } from 'rxjs';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-lut-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtLUTEffect), provideCommonEffectRef(NgtLUTEffect)],
})
export class NgtLUTEffect extends NgtCommonEffect<LUT3DEffect> {
  override get effectType(): NgtAnyConstructor<LUT3DEffect> {
    return LUT3DEffect;
  }

  @Input() set lut(lut: NgtObservableInput<THREE.Texture>) {
    this.set({ lut });
  }

  @Input() set tetrahedralInterpolation(tetrahedralInterpolation: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      tetrahedralInterpolation: isObservable(tetrahedralInterpolation)
        ? tetrahedralInterpolation.pipe(map(coerceBoolean))
        : coerceBoolean(tetrahedralInterpolation),
    });
  }

  private readonly setLUT = this.effect(
    tap(() => {
      const { lut, tetrahedralInterpolation } = this.getState();
      const invalidate = this.store.getState((s) => s.invalidate);
      if (lut) {
        this.instanceValue.lut = lut;
      }

      if (tetrahedralInterpolation) {
        this.instanceValue.tetrahedralInterpolation = tetrahedralInterpolation;
      }

      invalidate();
    })
  );

  override postInit() {
    super.postInit();
    this.setLUT(
      this.select(
        this.instanceRef.pipe(filter((v) => !!v)),
        this.select((s) => s['lut']),
        this.select((s) => s['tetrahedralInterpolation']),
        this.defaultProjector
      )
    );
  }

  override initEffectArgs(): unknown[] {
    const [props] = super.initEffectArgs();
    const lut = this.getState((s) => s['lut']);
    delete (props as NgtUnknownRecord)['lut'];
    return [lut, props];
  }

  override get extraEffectArgs(): Array<{ name: string; fromComposer?: boolean }> {
    return [...super.extraEffectArgs, { name: 'lut' }];
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'lut', 'tetrahedralInterpolation'];
  }
}
