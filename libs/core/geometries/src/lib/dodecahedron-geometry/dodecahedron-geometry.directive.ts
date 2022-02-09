// GENERATED
import { NGT_OBJECT_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-dodecahedron-geometry',
  exportAs: 'ngtDodecahedronGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtDodecahedronGeometry,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtDodecahedronGeometry extends NgtGeometry<THREE.DodecahedronGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.DodecahedronGeometry>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.DodecahedronGeometry>
  ) {
    this.geometryArgs = v;
  }

  geometryType = THREE.DodecahedronGeometry;
}

@NgModule({
  declarations: [NgtDodecahedronGeometry],
  exports: [NgtDodecahedronGeometry],
})
export class NgtDodecahedronGeometryModule {}
