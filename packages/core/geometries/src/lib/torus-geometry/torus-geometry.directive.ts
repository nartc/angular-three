// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-torus-geometry',
  exportAs: 'ngtTorusGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtTorusGeometry,
    },
  ],
})
export class NgtTorusGeometry extends NgtGeometry<THREE.TorusGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.TorusGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.TorusGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.TorusGeometry;
}

@NgModule({
  declarations: [NgtTorusGeometry],
  exports: [NgtTorusGeometry],
})
export class NgtTorusGeometryModule {}
