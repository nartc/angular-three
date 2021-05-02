// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial, DataTexture, DataTexture3D } from 'three';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass';

@Directive({
  selector: 'ngt-lutpass',
  exportAs: 'ngtLUTPass',
  providers: [{ provide: ThreePass, useExisting: LUTPassDirective }],
})
export class LUTPassDirective extends ThreePass<LUTPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof LUTPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof LUTPass>) {
    this.extraArgs = v;
  }

  @Input() lut?: DataTexture | DataTexture3D;
  @Input() intensity?: number;

  passType = LUTPass;
  extraInputs = ['lut', 'intensity'];
}
