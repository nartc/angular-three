// GENERATED
import { NGT_OBJECT_3D_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-cone-geometry',
  exportAs: 'ngtConeGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtConeGeometry,
    },
    NGT_OBJECT_3D_PROVIDER,
  ],
})
export class NgtConeGeometry extends NgtGeometry<THREE.ConeGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.ConeGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.ConeGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.ConeGeometry;
}

@NgModule({
  declarations: [NgtConeGeometry],
  exports: [NgtConeGeometry],
})
export class NgtConeGeometryModule {}
