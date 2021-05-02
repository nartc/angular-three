// GENERATED

import type {
  UnknownRecord,
  WithoutCameraConstructorParameters,
} from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { Mesh, CubeTexture, PerspectiveCamera, Scene } from 'three';
import { CubeTexturePass } from 'three/examples/jsm/postprocessing/CubeTexturePass';

@Directive({
  selector: 'ngt-cube-texture-pass',
  exportAs: 'ngtCubeTexturePass',
  providers: [{ provide: ThreePass, useExisting: CubeTexturePassDirective }],
})
export class CubeTexturePassDirective extends ThreePass<CubeTexturePass> {
  static ngAcceptInputType_args:
    | WithoutCameraConstructorParameters<
        ConstructorParameters<typeof CubeTexturePass>
      >
    | undefined;

  @Input() set args(
    v: WithoutCameraConstructorParameters<
      ConstructorParameters<typeof CubeTexturePass>
    >
  ) {
    this.extraArgs = v;
  }

  @Input() cubeShader?: UnknownRecord;
  @Input() cubeMesh?: Mesh;
  @Input() envMap?: CubeTexture;
  @Input() cubeScene?: Scene;
  @Input() cubeCamera?: PerspectiveCamera;

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
