import {
  Directive,
  EventEmitter,
  Inject,
  Optional,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import {
  NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER,
  NgtMaterialGeometryController,
} from '../controllers/material-geometry.controller';

@Directive()
export abstract class NgtCommonMesh<TMesh extends THREE.Mesh = THREE.Mesh> {
  @Output() ready = new EventEmitter<TMesh>();

  constructor(
    @Optional()
    @Inject(NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER)
    protected materialGeometryController: NgtMaterialGeometryController
  ) {
    if (materialGeometryController) {
      materialGeometryController.readyFn = () => {
        this.ready.emit(this.mesh);
      };
    }
  }

  get mesh() {
    return this.materialGeometryController?.object as TMesh;
  }
}
