// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-box-geometry',
  exportAs: 'ngtBoxGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtBoxGeometry,
    }
  ],
})
export class NgtBoxGeometry extends NgtGeometry<THREE.BoxGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.BoxGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.BoxGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.BoxGeometry;
}
