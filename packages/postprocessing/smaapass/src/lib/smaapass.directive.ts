// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { WebGLRenderTarget, Texture, ShaderMaterial } from 'three';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';

@Directive({
  selector: 'ngt-smaapass',
  exportAs: 'ngtSMAAPass',
  providers: [{ provide: ThreePass, useExisting: SMAAPassDirective }],
})
export class SMAAPassDirective extends ThreePass<SMAAPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SMAAPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SMAAPass>) {
    this.extraArgs = v;
  }

  @Input() edgesRT?: WebGLRenderTarget;
  @Input() weightsRT?: WebGLRenderTarget;
  @Input() areaTexture?: Texture;
  @Input() searchTexture?: Texture;
  @Input() uniformsEdges?: UnknownRecord;
  @Input() materialEdges?: ShaderMaterial;
  @Input() uniformsWeights?: UnknownRecord;
  @Input() materialWeights?: ShaderMaterial;
  @Input() uniformsBlend?: UnknownRecord;
  @Input() materialBlend?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = SMAAPass;
  extraInputs = [
    'edgesRT',
    'weightsRT',
    'areaTexture',
    'searchTexture',
    'uniformsEdges',
    'materialEdges',
    'uniformsWeights',
    'materialWeights',
    'uniformsBlend',
    'materialBlend',
    'fsQuad',
  ];
}
