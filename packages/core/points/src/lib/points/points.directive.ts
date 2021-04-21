import {
  AnyConstructor,
  ThreeObject3d,
  ThreeObject3dMaterialGeometry,
} from '@angular-three/core';
import { ThreeBufferGeometry } from '@angular-three/core/geometries';
import { ThreeMaterial } from '@angular-three/core/materials';
import { ContentChild, Directive } from '@angular/core';
import { Points } from 'three';

@Directive({
  selector: 'ngt-points',
  exportAs: 'ngtPoints',
  providers: [
    { provide: ThreeObject3d, useExisting: PointsDirective, multi: true },
  ],
})
export class PointsDirective extends ThreeObject3dMaterialGeometry<Points> {
  @ContentChild(ThreeMaterial) set materialDirective(v: ThreeMaterial) {
    if (this.material == null) {
      this.material = v.material;
    }
  }

  @ContentChild(ThreeBufferGeometry)
  set bufferGeometryDirective(v: ThreeBufferGeometry) {
    if (this.geometry == null) {
      this.geometry = v.bufferGeometry;
    }
  }

  get objectType(): AnyConstructor<Points> {
    return Points;
  }
}
