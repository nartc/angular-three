// GENERATED
import { AnyConstructor, coerceNumberProperty, NumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { BlendFunction, ScanlineEffect } from 'postprocessing';

@Component({
  selector: 'ngt-scanline-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtScanlineEffect)],
})
export class NgtScanlineEffect extends NgtCommonEffect<ScanlineEffect> {
  override get effectType(): AnyConstructor<ScanlineEffect> {
    return ScanlineEffect;
  }

  @Input() set density(density: NumberInput) {
    this.set({ density: coerceNumberProperty(density) });
  }

  protected override get defaultBlendMode(): BlendFunction {
    return BlendFunction.OVERLAY;
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      density: true,
    };
  }
}

@NgModule({
  imports: [NgtScanlineEffect],
  exports: [NgtScanlineEffect],
})
export class NgtScanlineEffectModule {}
