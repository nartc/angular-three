import { Directive, Inject, NgZone, Optional } from '@angular/core';
import * as THREE from 'three';
import {
  NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER,
  NgtMaterialGeometryController,
} from '../controllers/material-geometry.controller';

@Directive()
export abstract class NgtCommonMesh<TMesh extends THREE.Mesh = THREE.Mesh> {
  constructor(
    @Optional()
    @Inject(NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER)
    protected materialGeometryController: NgtMaterialGeometryController | null,
    protected ngZone: NgZone
  ) {}

  get mesh() {
    return this.materialGeometryController?.objectController.object3d as TMesh;
  }
}
