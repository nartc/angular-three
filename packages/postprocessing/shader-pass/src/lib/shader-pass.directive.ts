// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial } from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

@Directive({
  selector: 'ngt-shader-pass',
  exportAs: 'ngtShaderPass',
  providers: [{ provide: ThreePass, useExisting: ShaderPassDirective }],
})
export class ShaderPassDirective extends ThreePass<ShaderPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof ShaderPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof ShaderPass>) {
    this.extraArgs = v;
  }

  @Input() textureID?: string;
  @Input() uniforms?: UnknownRecord;
  @Input() material?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = ShaderPass;
  extraInputs = ['textureID', 'uniforms', 'material', 'fsQuad'];
}
