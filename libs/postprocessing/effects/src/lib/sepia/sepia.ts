// GENERATED
import { AnyConstructor } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { SepiaEffect } from 'postprocessing';

@Component({
  selector: 'ngt-sepia',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtSepia)],
})
export class NgtSepia extends NgtCommonEffect<SepiaEffect> {
  static ngAcceptInputType_options: ConstructorParameters<AnyConstructor<SepiaEffect>>[0] | undefined;

  override get effectType(): AnyConstructor<SepiaEffect> {
    return SepiaEffect;
  }
}

@NgModule({
  declarations: [NgtSepia],
  exports: [NgtSepia],
})
export class NgtSepiaModule {}
