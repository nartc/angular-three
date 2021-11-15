// GENERATED
import type {
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass';

@Directive({
  selector: 'ngt-texture-pass',
  exportAs: 'ngtTexturePass',
  providers: [{ provide: NgtPass, useExisting: NgtTexturePass }],
})
export class NgtTexturePass extends NgtPass<TexturePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TexturePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof TexturePass>) {
    this.extraArgs = v;
  }
  
  @Input() uniforms?: UnknownRecord;
  @Input() material?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = TexturePass;
  extraInputs = [
    'uniforms',
    'material',
    'fsQuad',
  ];
}
