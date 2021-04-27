// GENERATED
import { ThreeTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DataTexture3D } from 'three';

@Directive({
  selector: 'ngt-data-texture3-d',
  exportAs: 'ngtDataTexture3D',
  providers: [
    {
      provide: ThreeTexture,
      useExisting: DataTexture3DDirective,
    },
  ],
})
export class DataTexture3DDirective extends ThreeTexture<DataTexture3D> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DataTexture3D>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof DataTexture3D>) {
    this.extraArgs = v;
  }

  textureType = DataTexture3D;
}
