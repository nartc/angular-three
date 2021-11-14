import type { QueryList } from '@angular/core';
import { ContentChild, ContentChildren, Directive } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../models';
import { NgtGeometry } from './geometry';
import { NgtMaterial } from './material';
import { NgtObject3dMaterialGeometry } from './object-3d-material-geometry';

@Directive()
export abstract class NgtMesh<
  TMesh extends THREE.Mesh = THREE.Mesh
> extends NgtObject3dMaterialGeometry<TMesh> {
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
    if (this.geometry == null && v) {
      this.geometry = v.geometry;
    }
  }

  abstract meshType: AnyConstructor<TMesh>;

  get objectType(): AnyConstructor<TMesh> {
    return this.meshType;
  }
}
