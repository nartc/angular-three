// GENERATED
import { NgtTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-video-texture',
  exportAs: 'ngtVideoTexture',
  providers: [
    {
      provide: NgtTexture,
      useExisting: NgtVideoTexture,
    },
  ],
})
export class NgtVideoTexture extends NgtTexture<THREE.VideoTexture> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.VideoTexture>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.VideoTexture>) {
    this.extraArgs = v;
  }

  textureType = THREE.VideoTexture;
}
