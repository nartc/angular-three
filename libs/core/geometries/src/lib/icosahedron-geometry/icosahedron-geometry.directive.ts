// GENERATED
import { NGT_OBJECT_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-icosahedron-geometry',
  exportAs: 'ngtIcosahedronGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtIcosahedronGeometry,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtIcosahedronGeometry extends NgtGeometry<THREE.IcosahedronGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.IcosahedronGeometry>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.IcosahedronGeometry>
  ) {
    this.geometryArgs = v;
  }

  geometryType = THREE.IcosahedronGeometry;
}

@NgModule({
  declarations: [NgtIcosahedronGeometry],
  exports: [NgtIcosahedronGeometry],
})
export class NgtIcosahedronGeometryModule {}
