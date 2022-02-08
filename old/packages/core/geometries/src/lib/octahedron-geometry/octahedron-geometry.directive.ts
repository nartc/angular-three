// GENERATED
import { NGT_OBJECT_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-octahedron-geometry',
  exportAs: 'ngtOctahedronGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtOctahedronGeometry,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtOctahedronGeometry extends NgtGeometry<THREE.OctahedronGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.OctahedronGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.OctahedronGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.OctahedronGeometry;
}

@NgModule({
  declarations: [NgtOctahedronGeometry],
  exports: [NgtOctahedronGeometry],
})
export class NgtOctahedronGeometryModule {}
