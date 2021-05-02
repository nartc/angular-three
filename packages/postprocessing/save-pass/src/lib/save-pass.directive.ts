// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { WebGLRenderTarget, ShaderMaterial } from 'three';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass';

@Directive({
  selector: 'ngt-save-pass',
  exportAs: 'ngtSavePass',
  providers: [{ provide: ThreePass, useExisting: SavePassDirective }],
})
export class SavePassDirective extends ThreePass<SavePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SavePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SavePass>) {
    this.extraArgs = v;
  }

  @Input() textureID?: string;
  @Input() renderTarget?: WebGLRenderTarget;
  @Input() uniforms?: UnknownRecord;
  @Input() material?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = SavePass;
  extraInputs = ['textureID', 'renderTarget', 'uniforms', 'material', 'fsQuad'];
}
