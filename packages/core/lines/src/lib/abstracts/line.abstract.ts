import {
  AnyConstructor,
  ThreeBufferGeometry,
  ThreeMaterial,
  ThreeObject3dMaterialGeometry,
} from '@angular-three/core';
import type { QueryList } from '@angular/core';
import { ContentChild, ContentChildren, Directive } from '@angular/core';
import { Line } from 'three';

@Directive()
export abstract class ThreeLine<
  TLine extends Line = Line
> extends ThreeObject3dMaterialGeometry<TLine> {
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

  abstract lineType: AnyConstructor<TLine>;

  get objectType(): AnyConstructor<TLine> {
    return this.lineType;
  }
}
