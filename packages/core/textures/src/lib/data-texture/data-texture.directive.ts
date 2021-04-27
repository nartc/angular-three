// GENERATED
import { ThreeTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DataTexture } from 'three';

@Directive({
  selector: 'ngt-data-texture',
  exportAs: 'ngtDataTexture',
  providers: [
    {
      provide: ThreeTexture,
      useExisting: DataTextureDirective,
    },
  ],
})
export class DataTextureDirective extends ThreeTexture<DataTexture> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DataTexture>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof DataTexture>) {
    this.extraArgs = v;
  }

  textureType = DataTexture;
}
