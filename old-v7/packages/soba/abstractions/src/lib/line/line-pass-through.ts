import { createPassThroughInput } from '@angular-three/core';
import { Directive, inject, Input } from '@angular/core';
import { NgtSobaLine } from './line';

@Directive({
  selector: '[ngtSobaLinePassThrough]',
  standalone: true,
})
export class NgtSobaLinePassThrough {
  private readonly host = inject(NgtSobaLine, { optional: true, self: true });

  @Input() set ngtSobaLinePassThrough(wrapper: unknown) {
    if (!this.host) return;

    NgtSobaLinePassThrough.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.host);

    passThroughInput('points');
    passThroughInput('vertexColors');
    passThroughInput('dashed');
    passThroughInput('lineWidth');
    passThroughInput('resolution');
  }

  private static assertWrapper(wrapper: unknown): asserts wrapper is NgtSobaLine {
    if (!(wrapper instanceof NgtSobaLine)) {
      throw new Error(`[NgtSobaLinePassThrough] wrapper is not an NgtSobaLine`);
    }
  }
}
