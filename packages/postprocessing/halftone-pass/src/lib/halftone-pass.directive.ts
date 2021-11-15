// GENERATED
import type { UnknownRecord } from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass';

@Directive({
  selector: 'ngt-halftone-pass',
  exportAs: 'ngtHalftonePass',
  providers: [{ provide: NgtPass, useExisting: NgtHalftonePass }],
})
export class NgtHalftonePass extends NgtPass<HalftonePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof HalftonePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof HalftonePass>) {
    this.extraArgs = v;
  }

  @Input() uniforms?: UnknownRecord;
  @Input() material?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = HalftonePass;
  extraInputs = ['uniforms', 'material', 'fsQuad'];
}
