// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial } from 'three';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';

@Directive({
  selector: 'ngt-dot-screen-pass',
  exportAs: 'ngtDotScreenPass',
  providers: [{ provide: ThreePass, useExisting: DotScreenPassDirective }],
})
export class DotScreenPassDirective extends ThreePass<DotScreenPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DotScreenPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof DotScreenPass>) {
    this.extraArgs = v;
  }

  @Input() uniforms?: UnknownRecord;
  @Input() material?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = DotScreenPass;
  extraInputs = ['uniforms', 'material', 'fsQuad'];
}
