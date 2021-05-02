// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial } from 'three';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass';

@Directive({
  selector: 'ngt-texture-pass',
  exportAs: 'ngtTexturePass',
  providers: [{ provide: ThreePass, useExisting: TexturePassDirective }],
})
export class TexturePassDirective extends ThreePass<TexturePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TexturePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof TexturePass>) {
    this.extraArgs = v;
  }

  @Input() uniforms?: UnknownRecord;
  @Input() material?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = TexturePass;
  extraInputs = ['uniforms', 'material', 'fsQuad'];
}
