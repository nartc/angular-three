// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { WebGLRenderTarget, ShaderMaterial } from 'three';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

@Directive({
  selector: 'ngt-afterimage-pass',
  exportAs: 'ngtAfterimagePass',
  providers: [{ provide: ThreePass, useExisting: AfterimagePassDirective }],
})
export class AfterimagePassDirective extends ThreePass<AfterimagePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof AfterimagePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof AfterimagePass>) {
    this.extraArgs = v;
  }

  @Input() shader?: UnknownRecord;
  @Input() uniforms?: UnknownRecord;
  @Input() textureComp?: WebGLRenderTarget;
  @Input() textureOld?: WebGLRenderTarget;
  @Input() shaderMaterial?: ShaderMaterial;
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
