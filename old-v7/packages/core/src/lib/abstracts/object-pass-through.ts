import { Directive, inject, Input } from '@angular/core';
import type { NgtBooleanInput } from '../types';
import { coerceBoolean } from '../utils/coercion';
import { createPassThroughInput, createPassThroughOutput } from '../utils/pass-through';
import { NgtObject } from './object';

@Directive({
  selector: '[ngtObjectPassThrough]',
  standalone: true,
})
export class NgtObjectPassThrough {
  private readonly host = inject(NgtObject, { optional: true, self: true });

  private _shouldPassThroughRef = false;
  @Input() set shouldPassThroughRef(value: NgtBooleanInput) {
    this._shouldPassThroughRef = coerceBoolean(value);
  }

  private _skipColor = false;
  @Input() set skipColor(value: NgtBooleanInput) {
    this._skipColor = coerceBoolean(value);
  }

  @Input() set ngtObjectPassThrough(wrapper: unknown) {
    if (!this.host) return;

    NgtObjectPassThrough.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.host);
    const passThroughOutput = createPassThroughOutput(wrapper, this.host);

    passThroughOutput('click');
    passThroughOutput('contextmenu');
    passThroughOutput('dblclick');
    passThroughOutput('pointerup');
    passThroughOutput('pointerdown');
    passThroughOutput('pointerover');
    passThroughOutput('pointerout');
    passThroughOutput('pointerenter');
    passThroughOutput('pointerleave');
    passThroughOutput('pointermove');
    passThroughOutput('pointermissed');
    passThroughOutput('pointercancel');
    passThroughOutput('wheel');
    passThroughOutput('ready');
    passThroughOutput('beforeRender');
    passThroughOutput('appended');

    if (this._shouldPassThroughRef) {
      this.host.ref = wrapper.instanceRef;
    }

    passThroughInput('attach');
    passThroughInput('skipWrapper');
    passThroughInput('noAttach');
    passThroughInput('name');
    passThroughInput('position');
    passThroughInput('rotation');
    passThroughInput('quaternion');
    passThroughInput('scale');
    if (!this._skipColor) {
      passThroughInput('color');
    }
    passThroughInput('userData');
    passThroughInput('castShadow');
    passThroughInput('receiveShadow');
    passThroughInput('visible');
    passThroughInput('matrixAutoUpdate');
    passThroughInput('dispose');
    passThroughInput('raycast');
    passThroughInput('appendMode');
    passThroughInput('appendTo');
  }

  private static assertWrapper(wrapper: unknown): asserts wrapper is NgtObject {
    if (!(wrapper instanceof NgtObject)) {
      throw new Error(`[NgtObjectPassThrough] wrapper is not an NgtObject`);
    }
  }
}
