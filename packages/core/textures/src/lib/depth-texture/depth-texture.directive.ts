// GENERATED
import { ThreeTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DepthTexture } from 'three';

@Directive({
  selector: 'ngt-depth-texture',
  exportAs: 'ngtDepthTexture',
  providers: [
    {
      provide: ThreeTexture,
      useExisting: DepthTextureDirective,
    },
  ],
})
export class DepthTextureDirective extends ThreeTexture<DepthTexture> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DepthTexture>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof DepthTexture>) {
    this.extraArgs = v;
  }

  textureType = DepthTexture;
}
