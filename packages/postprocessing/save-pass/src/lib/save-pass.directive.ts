// GENERATED
import type {
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass';

@Directive({
  selector: 'ngt-save-pass',
  exportAs: 'ngtSavePass',
  providers: [{ provide: NgtPass, useExisting: NgtSavePass }],
})
export class NgtSavePass extends NgtPass<SavePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SavePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SavePass>) {
    this.extraArgs = v;
  }
  
  @Input() textureID?: string;
  @Input() renderTarget?: THREE.WebGLRenderTarget;
  @Input() uniforms?: UnknownRecord;
  @Input() material?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = SavePass;
  extraInputs = [
    'textureID',
    'renderTarget',
    'uniforms',
    'material',
    'fsQuad',
  ];
}
