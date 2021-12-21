// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
  NgtPrimitive,
  NgtPrimitiveModule,
} from '@angular-three/core/primitive';
import {
  NGT_EFFECT_CONTROLLER_PROVIDER,
  NGT_EFFECT_DEFAULT_BLEND_FUNCTION,
  NGT_EFFECT_TYPE,
  NGT_EFFECT_WATCH_CONTROLLER,
  NgtEffectComposerModule,
  NgtEffectController,
  NgtEffectControllerModule,
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
import { BlendFunction, BloomEffect } from 'postprocessing';

@Component({
  selector: 'ngt-bloom',
  template: `
    <ngt-primitive
      *ngIf="effect"
      [disabled]="true"
      [object]="$any(effect)"
      [dispose]="null"
    ></ngt-primitive>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_EFFECT_CONTROLLER_PROVIDER,
    { provide: NGT_EFFECT_TYPE, useValue: BloomEffect },
    {
      provide: NGT_EFFECT_DEFAULT_BLEND_FUNCTION,
      useValue: BlendFunction.SCREEN,
    },
  ],
})
export class NgtBloom {
  static ngAcceptInputType_options:
    | ConstructorParameters<AnyConstructor<BloomEffect>>[0]
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
  declarations: [NgtBloom],
  exports: [NgtBloom, NgtEffectControllerModule],
  imports: [NgtPrimitiveModule, NgtEffectComposerModule, CommonModule],
})
export class NgtBloomModule {}
