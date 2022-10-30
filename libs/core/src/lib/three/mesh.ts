import { Directive } from '@angular/core';
import * as THREE from 'three';
import {
  NgtMaterialGeometry,
  provideNgtMaterialGeometry,
} from '../abstracts/material-geometry';
import type { AnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonMesh<
  TMesh extends THREE.Mesh = THREE.Mesh
> extends NgtMaterialGeometry<TMesh> {
  abstract get meshType(): AnyConstructor<TMesh>;

  override get objectType(): AnyConstructor<TMesh> {
    return this.meshType;
  }
}

export const provideNgtCommonMesh = createNgtProvider(
  NgtCommonMesh,
  provideNgtMaterialGeometry
);
