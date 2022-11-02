import { createPassThroughInput } from '@angular-three/core';
import { Directive, inject, Input } from '@angular/core';
import { NgtSpotLight } from '../spot-light/spot-light';

@Directive({
  selector: '[ngtSpotLightPassThrough]',
  standalone: true,
})
export class NgtSpotLightPassThrough {
  readonly #host = inject(NgtSpotLight, { self: true, optional: true });

  @Input() set ngtSpotLightPassThrough(wrapper: unknown) {
    if (!this.#host) {
      return;
    }

    NgtSpotLightPassThrough.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.#host);

    passThroughInput('distance', true, true);
    passThroughInput('angle', true, true);
    passThroughInput('penumbra', true, true);
    passThroughInput('decay', true, true);
    passThroughInput('target', true, true);
    passThroughInput('power', true, true);
  }

  private static assertWrapper(
    wrapper: unknown
  ): asserts wrapper is NgtSpotLight {
    if (!wrapper || !(wrapper instanceof NgtSpotLight)) {
      throw new Error('ngtSpotLightPassThrough wrapper is not a NgtSpotLight');
    }
  }
}
