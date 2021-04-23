// GENERATED

import { Directive, Input } from '@angular/core';
import { CubeTexture } from 'three';
import { ThreeTexture } from '../abstracts';

@Directive({
  selector: 'ngt-cubeTexture',
  exportAs: 'ngtCubeTexture',
  providers: [
    {
      provide: ThreeTexture,
      useExisting: CubeTextureDirective,
    },
  ],
})
export class CubeTextureDirective extends ThreeTexture<CubeTexture> {
  static ngAcceptInputType_args: ConstructorParameters<typeof CubeTexture> | undefined;

  @Input() set args(v: ConstructorParameters<typeof CubeTexture>) {
    this.extraArgs = v;
  }

  textureType = CubeTexture;
}
