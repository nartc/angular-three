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
  NGT_OBJECT_TYPE,
  NgtMaterialGeometryController,
} from '../controllers/material-geometry.controller';

@Directive({
  providers: [{ provide: NGT_OBJECT_TYPE, useValue: THREE.Line }],
})
export abstract class NgtCommonLine<TLine extends THREE.Line = THREE.Line> {
  @Output() ready = new EventEmitter<TLine>();

  constructor(
    @Optional()
    @Inject(NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER)
    protected materialGeometryController: NgtMaterialGeometryController
  ) {
    if (materialGeometryController) {
      materialGeometryController.readyFn = () => {
        this.ready.emit(this.line);
      };
    }
  }

  get line() {
    return this.materialGeometryController?.objectController.object as TLine;
  }
}
