// GENERATED
import { ThreeTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { CanvasTexture } from 'three';

@Directive({
  selector: 'ngt-canvas-texture',
  exportAs: 'ngtCanvasTexture',
  providers: [
    {
      provide: ThreeTexture,
      useExisting: CanvasTextureDirective,
    },
  ],
})
export class CanvasTextureDirective extends ThreeTexture<CanvasTexture> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof CanvasTexture>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof CanvasTexture>) {
    this.extraArgs = v;
  }

  textureType = CanvasTexture;
}
