// GENERATED
import { ThreeTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { CompressedTexture } from 'three';

@Directive({
  selector: 'ngt-compressed-texture',
  exportAs: 'ngtCompressedTexture',
  providers: [
    {
      provide: ThreeTexture,
      useExisting: CompressedTextureDirective,
    },
  ],
})
export class CompressedTextureDirective extends ThreeTexture<CompressedTexture> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof CompressedTexture>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof CompressedTexture>) {
    this.extraArgs = v;
  }

  textureType = CompressedTexture;
}
