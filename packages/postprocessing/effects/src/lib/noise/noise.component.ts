import { NgtCoreModule } from '@angular-three/core';
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
import { BlendFunction, NoiseEffect } from 'postprocessing';

@Component({
  selector: 'ngt-noise',
  exportAs: 'ngtNoise',
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
    { provide: NGT_EFFECT_TYPE, useValue: NoiseEffect },
    {
      provide: NGT_EFFECT_DEFAULT_BLEND_FUNCTION,
      useValue: BlendFunction.COLOR_DODGE,
    },
  ],
})
export class NgtNoise {
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
  declarations: [NgtNoise],
  exports: [NgtNoise],
  imports: [
    NgtCoreModule,
    NgtPrimitiveModule,
    NgtEffectComposerModule,
    CommonModule,
  ],
})
export class NgtNoiseModule {}
