import { Directive, Inject, Optional } from '@angular/core';
import * as THREE from 'three';
import {
  NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER,
  NGT_OBJECT_TYPE,
  NgtMaterialGeometryController,
} from '../controllers/material-geometry.controller';

@Directive({
  providers: [{ provide: NGT_OBJECT_TYPE, useValue: THREE.Line }],
})
export abstract class NgtCommonLine<TLine extends THREE.Line = THREE.Line> {
  constructor(
    @Optional()
    @Inject(NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER)
    protected materialGeometryController: NgtMaterialGeometryController | null
  ) {}

  get line() {
    return this.materialGeometryController?.objectController.object3d as TLine;
  }
}
