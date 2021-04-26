import type { QueryList } from '@angular/core';
import { ContentChild, ContentChildren, Directive } from '@angular/core';
import { Mesh } from 'three';
import type { AnyConstructor } from '../typings';
import { ThreeBufferGeometry } from './geometry.abstract';
import { ThreeMaterial } from './material.abstract';
import { ThreeObject3dMaterialGeometry } from './object-3d-material-geometry.abstract';

@Directive()
export abstract class ThreeMesh<
  TMesh extends Mesh = Mesh
> extends ThreeObject3dMaterialGeometry<TMesh> {
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
    if (this.geometry == null && v) {
      this.geometry = v.bufferGeometry;
    }
  }

  abstract meshType: AnyConstructor<TMesh>;

  get objectType(): AnyConstructor<TMesh> {
    return this.meshType;
  }
}
