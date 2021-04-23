import type { AnyConstructor } from '@angular-three/core';
import { ThreeObject3dMaterialGeometry } from '@angular-three/core';
import { ThreeBufferGeometry } from '@angular-three/core/geometries';
import { ThreeMaterial } from '@angular-three/core/materials';
import {
  ContentChild,
  ContentChildren,
  Directive,
  QueryList,
} from '@angular/core';
import { Mesh } from 'three';

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
