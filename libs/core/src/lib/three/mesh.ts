import { Directive } from '@angular/core';
import * as THREE from 'three/src/Three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonMesh<TMesh extends THREE.Mesh = THREE.Mesh> extends NgtMaterialGeometry<TMesh> {
  abstract get meshType(): AnyConstructor<TMesh>;

  override get objectType(): AnyConstructor<TMesh> {
    return this.meshType;
  }
}
