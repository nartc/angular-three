// GENERATED
import { ThreeTexture } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DataTexture2DArray } from 'three';

@Directive({
  selector: 'ngt-data-texture2-darray',
  exportAs: 'ngtDataTexture2DArray',
  providers: [
    {
      provide: ThreeTexture,
      useExisting: DataTexture2DArrayDirective,
    },
  ],
})
export class DataTexture2DArrayDirective extends ThreeTexture<DataTexture2DArray> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DataTexture2DArray>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof DataTexture2DArray>) {
    this.extraArgs = v;
  }

  textureType = DataTexture2DArray;
}
