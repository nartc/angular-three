// GENERATED
import { AnyConstructor } from '@angular-three/core';
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
import { DotScreenEffect } from 'postprocessing';

@Component({
  selector: 'ngt-dot-screen',
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
    { provide: NGT_EFFECT_TYPE, useValue: DotScreenEffect },
  ],
})
export class NgtDotScreen {
  static ngAcceptInputType_options:
    | ConstructorParameters<AnyConstructor<DotScreenEffect>>[0]
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
  declarations: [NgtDotScreen],
  exports: [NgtDotScreen, NgtEffectControllerModule],
  imports: [NgtPrimitiveModule, NgtEffectComposerModule, CommonModule],
})
export class NgtDotScreenModule {}
