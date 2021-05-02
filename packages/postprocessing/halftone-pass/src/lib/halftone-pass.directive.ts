// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial } from 'three';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass';

@Directive({
  selector: 'ngt-halftone-pass',
  exportAs: 'ngtHalftonePass',
  providers: [{ provide: ThreePass, useExisting: HalftonePassDirective }],
})
export class HalftonePassDirective extends ThreePass<HalftonePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof HalftonePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof HalftonePass>) {
    this.extraArgs = v;
  }

  @Input() uniforms?: UnknownRecord;
  @Input() material?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = HalftonePass;
  extraInputs = ['uniforms', 'material', 'fsQuad'];
}
