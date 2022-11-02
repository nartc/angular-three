import { Directive, inject, Input } from '@angular/core';
import { NgtObject, NgtObjectInputs } from '../abstracts/object';
import {
  createPassThroughInput,
  createPassThroughOutput,
} from '../utils/pass-through';

@Directive({
  selector: '[ngtObjectPassThrough]',
  standalone: true,
})
export class NgtObjectPassThrough {
  readonly #host = inject(NgtObject, { optional: true, self: true });

  @Input() set ngtObjectPassThrough(wrapper: unknown) {
    if (!this.#host) return;

    NgtObjectPassThrough.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.#host);
    const passThroughOutput = createPassThroughOutput(wrapper, this.#host);

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

    if (wrapper.shouldPassThroughRef) {
      this.#host.ref = wrapper.instance;
    }

    passThroughInput('attach');
    passThroughInput('skipParent');
    passThroughInput('noAttach');
    passThroughInput('name');
    passThroughInput('position');
    passThroughInput('rotation');
    passThroughInput('quaternion');
    passThroughInput('scale');
    passThroughInput('color');
    passThroughInput('userData');
    passThroughInput('castShadow', true);
    passThroughInput('receiveShadow', true);
    passThroughInput('visible');
    passThroughInput('matrixAutoUpdate');
    passThroughInput('dispose', true);
    passThroughInput('raycast', true);
    passThroughInput('appendMode');
    passThroughInput('appendTo', true);
  }

  private static assertWrapper(
    wrapper: unknown
  ): asserts wrapper is NgtObjectInputs {
    if (!(wrapper instanceof NgtObjectInputs)) {
      throw new Error(`[NgtObjectPassThrough] wrapper is not an NgtObject`);
    }
  }
}
