// GENERATED
import { NgtTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-data-texture',
  exportAs: 'ngtDataTexture',
  providers: [
    {
      provide: NgtTexture,
      useExisting: NgtDataTexture,
    },
  ],
})
export class NgtDataTexture extends NgtTexture<THREE.DataTexture> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.DataTexture>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.DataTexture>) {
    this.extraArgs = v;
  }

  textureType = THREE.DataTexture;
}
