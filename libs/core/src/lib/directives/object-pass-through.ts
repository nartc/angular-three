import { Directive, Input, NgModule, Optional, Self } from '@angular/core';
import { NgtObject, NgtObjectInputs } from '../abstracts/object';
import { createPassThroughInput, createPassThroughOutput } from '../utils/pass-through';

@Directive({
  selector: '[ngtObjectPassThrough]',
  standalone: true,
})
export class NgtObjectPassThrough {
  @Input() set ngtObjectPassThrough(wrapper: unknown) {
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

    if (wrapper.shouldPassThroughRef) {
      this.host.ref = wrapper.instance;
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

  constructor(@Optional() @Self() private host: NgtObject) {
    if (!host) return;
  }

  private static assertWrapper(wrapper: unknown): asserts wrapper is NgtObjectInputs {
    if (!(wrapper instanceof NgtObjectInputs)) {
      throw new Error(`[NgtObjectPassThrough] wrapper is not an NgtObject`);
    }
  }
}

@NgModule({
  imports: [NgtObjectPassThrough],
  exports: [NgtObjectPassThrough],
})
export class NgtObjectPassThroughModule {}
