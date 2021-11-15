// GENERATED
import type { UnknownRecord } from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

@Directive({
  selector: 'ngt-shader-pass',
  exportAs: 'ngtShaderPass',
  providers: [{ provide: NgtPass, useExisting: NgtShaderPass }],
})
export class NgtShaderPass extends NgtPass<ShaderPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof ShaderPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof ShaderPass>) {
    this.extraArgs = v;
  }

  @Input() textureID?: string;
  @Input() uniforms?: UnknownRecord;
  @Input() material?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = ShaderPass;
  extraInputs = ['textureID', 'uniforms', 'material', 'fsQuad'];
}
