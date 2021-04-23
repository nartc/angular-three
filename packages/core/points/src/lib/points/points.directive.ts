import {
  AnyConstructor,
  ThreeObject3d,
  ThreeObject3dMaterialGeometry,
} from '@angular-three/core';
import { ThreeBufferGeometry } from '@angular-three/core/geometries';
import { ThreeMaterial } from '@angular-three/core/materials';
import {
  ContentChild,
  ContentChildren,
  Directive,
  QueryList,
} from '@angular/core';
import { Points } from 'three';

@Directive({
  selector: 'ngt-points',
  exportAs: 'ngtPoints',
  providers: [{ provide: ThreeObject3d, useExisting: PointsDirective }],
})
export class PointsDirective extends ThreeObject3dMaterialGeometry<Points> {
  @ContentChildren(ThreeMaterial) set materialDirectives(
    v: QueryList<ThreeMaterial>
  ) {
    if (this.material == null && v) {
      this.material =
        v.length === 1
          ? v.first.material
          : v.toArray().map((dir) => dir.material);
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
