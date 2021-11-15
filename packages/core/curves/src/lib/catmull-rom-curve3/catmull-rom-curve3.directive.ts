// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-catmull-rom-curve3',
  exportAs: 'ngtCatmullRomCurve3',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtCatmullRomCurve3,
    },
  ],
})
export class NgtCatmullRomCurve3 extends NgtCurve<THREE.CatmullRomCurve3> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.CatmullRomCurve3>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.CatmullRomCurve3>) {
    this.extraArgs = v;
  }

  curveType = THREE.CatmullRomCurve3;
}
