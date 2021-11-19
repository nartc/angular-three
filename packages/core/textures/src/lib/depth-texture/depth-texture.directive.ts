// GENERATED
import { NgtTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-depth-texture',
  exportAs: 'ngtDepthTexture',
  providers: [
    {
      provide: NgtTexture,
      useExisting: NgtDepthTexture,
    }
  ],
})
export class NgtDepthTexture extends NgtTexture<THREE.DepthTexture> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DepthTexture> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.DepthTexture>) {
    this.extraArgs = v;
  }

  textureType = THREE.DepthTexture;
}
