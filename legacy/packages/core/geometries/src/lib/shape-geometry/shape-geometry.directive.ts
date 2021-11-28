// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-shape-geometry',
  exportAs: 'ngtShapeGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtShapeGeometry,
    }
  ],
})
export class NgtShapeGeometry extends NgtGeometry<THREE.ShapeGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ShapeGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.ShapeGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.ShapeGeometry;
}

@NgModule({
  declarations: [NgtShapeGeometry],
  exports: [NgtShapeGeometry],
})
export class NgtShapeGeometryModule {}

