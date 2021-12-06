// GENERATED
import { AnyConstructor, NgtCoreModule } from '@angular-three/core';
import {
  NgtPrimitive,
  NgtPrimitiveModule,
} from '@angular-three/core/primitive';
import {
  NGT_EFFECT_CONTROLLER_PROVIDER,
  NGT_EFFECT_TYPE,
  NGT_EFFECT_WATCH_CONTROLLER,
  NgtEffectComposerModule,
  NgtEffectController,
} from '@angular-three/postprocessing';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  ViewChild,
} from '@angular/core';
// @ts-ignore
import { HueSaturationEffect } from 'postprocessing';

@Component({
  selector: 'ngt-hue-saturation',
  exportAs: 'ngtHueSaturation',
  template: `
    <ngt-primitive
      *ngIf="effect"
      [object]="$any(effect)"
      [dispose]="null"
      appendMode="none"
    ></ngt-primitive>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_EFFECT_CONTROLLER_PROVIDER,
    { provide: NGT_EFFECT_TYPE, useValue: HueSaturationEffect },
  ],
})
export class NgtHueSaturation {
  static ngAcceptInputType_options:
    | ConstructorParameters<AnyConstructor<HueSaturationEffect>>[0]
    | undefined;

  @ViewChild(NgtPrimitive) primitive?: NgtPrimitive;

  constructor(
    @Inject(NGT_EFFECT_WATCH_CONTROLLER)
    private effectController: NgtEffectController
  ) {}

  get effect() {
    return this.effectController.effect;
  }
}

@NgModule({
  declarations: [NgtHueSaturation],
  exports: [NgtHueSaturation],
  imports: [
    NgtCoreModule,
    NgtPrimitiveModule,
    NgtEffectComposerModule,
    CommonModule,
  ],
})
export class NgtHueSaturationModule {}
