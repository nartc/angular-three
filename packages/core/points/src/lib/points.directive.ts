import {
  AnyConstructor,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtGeometry,
  NgtMaterial,
  NgtObject3d,
  NgtObject3dMaterialGeometry,
} from '@angular-three/core';
import {
  ContentChild,
  ContentChildren,
  Directive,
  QueryList,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-points',
  exportAs: 'ngtPoints',
  providers: [
    { provide: NgtObject3d, useExisting: NgtPoints },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtPoints extends NgtObject3dMaterialGeometry<THREE.Points> {
  @ContentChildren(NgtMaterial) set materialDirectives(
    v: QueryList<NgtMaterial>
  ) {
    if (this.material == null && v) {
      this.material =
        v.length === 1
          ? v.first.material
          : v.toArray().map((dir) => dir.material);
    }
  }

  @ContentChild(NgtGeometry)
  set bufferGeometryDirective(v: NgtGeometry) {
    if (this.geometry == null) {
      this.geometry = v.geometry;
    }
  }

  get objectType(): AnyConstructor<THREE.Points> {
    return THREE.Points;
  }
}
