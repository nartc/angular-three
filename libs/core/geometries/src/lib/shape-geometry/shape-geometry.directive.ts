// GENERATED
import { NGT_OBJECT_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-shape-geometry',
  exportAs: 'ngtShapeGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtShapeGeometry,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtShapeGeometry extends NgtGeometry<THREE.ShapeGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.ShapeGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.ShapeGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.ShapeGeometry;
}

@NgModule({
  declarations: [NgtShapeGeometry],
  exports: [NgtShapeGeometry],
})
export class NgtShapeGeometryModule {}
