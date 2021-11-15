// GENERATED
import type {
  UnknownRecord,
  LessFirstConstructorParameters,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { CubeTexturePass } from 'three/examples/jsm/postprocessing/CubeTexturePass';

@Directive({
  selector: 'ngt-cube-texture-pass',
  exportAs: 'ngtCubeTexturePass',
  providers: [{ provide: NgtPass, useExisting: NgtCubeTexturePass }],
})
export class NgtCubeTexturePass extends NgtPass<CubeTexturePass> {
  static ngAcceptInputType_args:
    | LessFirstConstructorParameters<
        ConstructorParameters<typeof CubeTexturePass>
      >
    | undefined;

  @Input() set args(
    v: LessFirstConstructorParameters<
      ConstructorParameters<typeof CubeTexturePass>
    >
  ) {
    this.extraArgs = v;
  }

  @Input() cubeShader?: UnknownRecord;
  @Input() cubeMesh?: THREE.Mesh;
  @Input() envMap?: THREE.CubeTexture;
  @Input() cubeScene?: THREE.Scene;
  @Input() cubeCamera?: THREE.PerspectiveCamera;

  passType = CubeTexturePass;
  extraInputs = ['cubeShader', 'cubeMesh', 'envMap', 'cubeScene', 'cubeCamera'];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'camera';
  }
}
