import {
  NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
  NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER,
  NGT_OBJECT_TYPE,
  NgtMaterialGeometryController,
  NgtMaterialGeometryControllerModule,
} from '@angular-three/core';
import { Directive, Inject, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-points',
  exportAs: 'ngtPoints',
  providers: [
    NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
    { provide: NGT_OBJECT_TYPE, useValue: THREE.Points },
  ],
})
export class NgtPoints {
  constructor(
    @Inject(NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER)
    private materialGeometryController: NgtMaterialGeometryController
  ) {}

  get points() {
    return this.materialGeometryController.objectController
      .object3d as THREE.Points;
  }
}

@NgModule({
  declarations: [NgtPoints],
  exports: [NgtPoints, NgtMaterialGeometryControllerModule],
})
export class NgtPointsModule {}
