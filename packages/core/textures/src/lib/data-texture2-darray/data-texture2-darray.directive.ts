// GENERATED
import { NgtTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-data-texture2-darray',
  exportAs: 'ngtDataTexture2DArray',
  providers: [
    {
      provide: NgtTexture,
      useExisting: NgtDataTexture2DArray,
    },
  ],
})
export class NgtDataTexture2DArray extends NgtTexture<THREE.DataTexture2DArray> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.DataTexture2DArray>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.DataTexture2DArray>) {
    this.extraArgs = v;
  }

  textureType = THREE.DataTexture2DArray;
}
