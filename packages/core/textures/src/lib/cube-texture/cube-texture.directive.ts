// GENERATED
import { NgtTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-cube-texture',
  exportAs: 'ngtCubeTexture',
  providers: [
    {
      provide: NgtTexture,
      useExisting: NgtCubeTexture,
    },
  ],
})
export class NgtCubeTexture extends NgtTexture<THREE.CubeTexture> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.CubeTexture>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.CubeTexture>) {
    this.extraArgs = v;
  }

  textureType = THREE.CubeTexture;
}
