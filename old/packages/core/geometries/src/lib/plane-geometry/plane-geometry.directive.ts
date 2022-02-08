// GENERATED
import { NGT_OBJECT_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-plane-geometry',
  exportAs: 'ngtPlaneGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtPlaneGeometry,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtPlaneGeometry extends NgtGeometry<THREE.PlaneGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.PlaneGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PlaneGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.PlaneGeometry;
}

@NgModule({
  declarations: [NgtPlaneGeometry],
  exports: [NgtPlaneGeometry],
})
export class NgtPlaneGeometryModule {}
