// GENERATED
import type {
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';

@Directive({
  selector: 'ngt-dot-screen-pass',
  exportAs: 'ngtDotScreenPass',
  providers: [{ provide: NgtPass, useExisting: NgtDotScreenPass }],
})
export class NgtDotScreenPass extends NgtPass<DotScreenPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DotScreenPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof DotScreenPass>) {
    this.extraArgs = v;
  }
  
  @Input() uniforms?: UnknownRecord;
  @Input() material?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = DotScreenPass;
  extraInputs = [
    'uniforms',
    'material',
    'fsQuad',
  ];
}
