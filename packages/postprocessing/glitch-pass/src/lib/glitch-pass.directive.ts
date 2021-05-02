// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial } from 'three';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

@Directive({
  selector: 'ngt-glitch-pass',
  exportAs: 'ngtGlitchPass',
  providers: [{ provide: ThreePass, useExisting: GlitchPassDirective }],
})
export class GlitchPassDirective extends ThreePass<GlitchPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof GlitchPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof GlitchPass>) {
    this.extraArgs = v;
  }

  @Input() uniforms?: UnknownRecord;
  @Input() material?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;
  @Input() goWild?: boolean;
  @Input() curF?: number;
  @Input() randX?: number;

  passType = GlitchPass;
  extraInputs = ['uniforms', 'material', 'fsQuad', 'goWild', 'curF', 'randX'];
}
