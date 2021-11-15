// GENERATED
import type {
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

@Directive({
  selector: 'ngt-afterimage-pass',
  exportAs: 'ngtAfterimagePass',
  providers: [{ provide: NgtPass, useExisting: NgtAfterimagePass }],
})
export class NgtAfterimagePass extends NgtPass<AfterimagePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof AfterimagePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof AfterimagePass>) {
    this.extraArgs = v;
  }
  
  @Input() shader?: UnknownRecord;
  @Input() uniforms?: UnknownRecord;
  @Input() textureComp?: THREE.WebGLRenderTarget;
  @Input() textureOld?: THREE.WebGLRenderTarget;
  @Input() shaderMaterial?: THREE.ShaderMaterial;
  @Input() compFsQuad?: UnknownRecord;
  @Input() copyFsQuad?: UnknownRecord;

  passType = AfterimagePass;
  extraInputs = [
    'shader',
    'uniforms',
    'textureComp',
    'textureOld',
    'shaderMaterial',
    'compFsQuad',
    'copyFsQuad',
  ];
}
