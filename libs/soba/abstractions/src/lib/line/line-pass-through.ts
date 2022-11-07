import { createPassThroughInput } from '@angular-three/core';
import { Directive, inject, Input } from '@angular/core';
import { NgtSobaLine } from './line';

@Directive({
  selector: '[ngtSobaLinePassThrough]',
  standalone: true,
})
export class NgtSobaLinePassThrough {
  readonly #host = inject(NgtSobaLine, { optional: true, self: true });

  @Input() set ngtSobaLinePassThrough(wrapper: unknown) {
    if (!this.#host) return;

    NgtSobaLinePassThrough.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.#host);

    passThroughInput('points', false, true);
    passThroughInput('vertexColors', false, true);
    passThroughInput('dashed', false, true);
    passThroughInput('lineWidth', false, true);
    passThroughInput('resolution', false, true);
  }

  private static assertWrapper(
    wrapper: unknown
  ): asserts wrapper is NgtSobaLine {
    if (!(wrapper instanceof NgtSobaLine)) {
      throw new Error(`[NgtSobaLinePassThrough] wrapper is not an NgtSobaLine`);
    }
  }
}
