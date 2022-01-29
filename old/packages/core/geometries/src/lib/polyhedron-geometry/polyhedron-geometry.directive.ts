// GENERATED
import { NGT_OBJECT_3D_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-polyhedron-geometry',
  exportAs: 'ngtPolyhedronGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtPolyhedronGeometry,
    },
    NGT_OBJECT_3D_PROVIDER,
  ],
})
export class NgtPolyhedronGeometry extends NgtGeometry<THREE.PolyhedronGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.PolyhedronGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PolyhedronGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.PolyhedronGeometry;
}

@NgModule({
  declarations: [NgtPolyhedronGeometry],
  exports: [NgtPolyhedronGeometry],
})
export class NgtPolyhedronGeometryModule {}
