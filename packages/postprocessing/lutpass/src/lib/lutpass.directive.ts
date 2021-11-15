// GENERATED
import type { UnknownRecord } from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass';

@Directive({
  selector: 'ngt-lutpass',
  exportAs: 'ngtLUTPass',
  providers: [{ provide: NgtPass, useExisting: NgtLUTPass }],
})
export class NgtLUTPass extends NgtPass<LUTPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof LUTPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof LUTPass>) {
    this.extraArgs = v;
  }

  @Input() lut?: THREE.DataTexture | THREE.DataTexture3D;
  @Input() intensity?: number;

  passType = LUTPass;
  extraInputs = ['lut', 'intensity'];
}
