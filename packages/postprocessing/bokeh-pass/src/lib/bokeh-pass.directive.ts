// GENERATED
import type {
  UnknownRecord,
  LessFirstTwoConstructorParameters,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';

@Directive({
  selector: 'ngt-bokeh-pass',
  exportAs: 'ngtBokehPass',
  providers: [{ provide: NgtPass, useExisting: NgtBokehPass }],
})
export class NgtBokehPass extends NgtPass<BokehPass> {
  static ngAcceptInputType_args:
    | LessFirstTwoConstructorParameters<ConstructorParameters<typeof BokehPass>>
    | undefined;

  @Input() set args(
    v: LessFirstTwoConstructorParameters<
      ConstructorParameters<typeof BokehPass>
    >
  ) {
    this.extraArgs = v;
  }

  @Input() renderTargetColor?: THREE.WebGLRenderTarget;
  @Input() renderTargetDepth?: THREE.WebGLRenderTarget;
  @Input() materialDepth?: THREE.MeshDepthMaterial;
  @Input() materialBokeh?: THREE.ShaderMaterial;
  @Input() uniforms?: UnknownRecord;
  @Input() fsQuad?: UnknownRecord;
  @Input() oldClearColor?: THREE.Color;

  passType = BokehPass;
  extraInputs = [
    'renderTargetColor',
    'renderTargetDepth',
    'materialDepth',
    'materialBokeh',
    'uniforms',
    'fsQuad',
    'oldClearColor',
  ];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'sceneAndCamera';
  }
}
