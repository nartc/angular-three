import type { QueryList } from '@angular/core';
import { ContentChild, ContentChildren, Directive } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../models';
import { NgtGeometry } from './geometry';
import { NgtMaterial } from './material';
import { NgtObject3dMaterialGeometry } from './object-3d-material-geometry';

@Directive()
export abstract class NgtCommonLine<
  TLine extends THREE.Line = THREE.Line
> extends NgtObject3dMaterialGeometry<TLine> {
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

  abstract lineType: AnyConstructor<TLine>;

  get objectType(): AnyConstructor<TLine> {
    return this.lineType;
  }
}
