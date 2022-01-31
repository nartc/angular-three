// GENERATED
import { NGT_OBJECT_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-edges-geometry',
  exportAs: 'ngtEdgesGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtEdgesGeometry,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtEdgesGeometry extends NgtGeometry<THREE.EdgesGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.EdgesGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.EdgesGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.EdgesGeometry;
}

@NgModule({
  declarations: [NgtEdgesGeometry],
  exports: [NgtEdgesGeometry],
})
export class NgtEdgesGeometryModule {}
