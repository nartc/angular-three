// GENERATED
import type {
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';

@Directive({
  selector: 'ngt-smaapass',
  exportAs: 'ngtSMAAPass',
  providers: [{ provide: NgtPass, useExisting: NgtSMAAPass }],
})
export class NgtSMAAPass extends NgtPass<SMAAPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SMAAPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SMAAPass>) {
    this.extraArgs = v;
  }
  
  @Input() edgesRT?: THREE.WebGLRenderTarget;
  @Input() weightsRT?: THREE.WebGLRenderTarget;
  @Input() areaTexture?: THREE.Texture;
  @Input() searchTexture?: THREE.Texture;
  @Input() uniformsEdges?: UnknownRecord;
  @Input() materialEdges?: THREE.ShaderMaterial;
  @Input() uniformsWeights?: UnknownRecord;
  @Input() materialWeights?: THREE.ShaderMaterial;
  @Input() uniformsBlend?: UnknownRecord;
  @Input() materialBlend?: THREE.ShaderMaterial;
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
