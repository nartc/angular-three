// GENERATED
import { NGT_OBJECT_3D_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-sphere-geometry',
  exportAs: 'ngtSphereGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtSphereGeometry,
    },
    NGT_OBJECT_3D_PROVIDER,
  ],
})
export class NgtSphereGeometry extends NgtGeometry<THREE.SphereGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.SphereGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.SphereGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.SphereGeometry;
}

@NgModule({
  declarations: [NgtSphereGeometry],
  exports: [NgtSphereGeometry],
})
export class NgtSphereGeometryModule {}
