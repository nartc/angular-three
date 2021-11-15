// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-line-curve3',
  exportAs: 'ngtLineCurve3',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtLineCurve3,
    },
  ],
})
export class NgtLineCurve3 extends NgtCurve<THREE.LineCurve3> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LineCurve3> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.LineCurve3>) {
    this.extraArgs = v;
  }

  curveType = THREE.LineCurve3;
}
