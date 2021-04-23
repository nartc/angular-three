// GENERATED

import { Directive, Input } from '@angular/core';
import { DataTexture } from 'three';
import { ThreeTexture } from '../abstracts';

@Directive({
  selector: 'ngt-dataTexture',
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
