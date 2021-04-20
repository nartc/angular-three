import {
  AnyConstructor,
  ThreeObject3dMaterialGeometry,
} from '@angular-three/core';
import { ThreeBufferGeometry } from '@angular-three/core/geometries';
import { ThreeMaterial } from '@angular-three/core/materials';
import { ContentChild, Directive } from '@angular/core';
import { Line } from 'three';

@Directive()
export abstract class ThreeLine<
  TLine extends Line = Line
> extends ThreeObject3dMaterialGeometry<TLine> {
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

  abstract lineType: AnyConstructor<TLine>;

  get objectType(): AnyConstructor<TLine> {
    return this.lineType;
  }
}
