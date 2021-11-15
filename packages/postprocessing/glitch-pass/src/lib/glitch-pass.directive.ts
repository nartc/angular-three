// GENERATED
import type { UnknownRecord } from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

@Directive({
  selector: 'ngt-glitch-pass',
  exportAs: 'ngtGlitchPass',
  providers: [{ provide: NgtPass, useExisting: NgtGlitchPass }],
})
export class NgtGlitchPass extends NgtPass<GlitchPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof GlitchPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof GlitchPass>) {
    this.extraArgs = v;
  }

  @Input() uniforms?: UnknownRecord;
  @Input() material?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;
  @Input() goWild?: boolean;
  @Input() curF?: number;
  @Input() randX?: number;

  passType = GlitchPass;
  extraInputs = ['uniforms', 'material', 'fsQuad', 'goWild', 'curF', 'randX'];
}
