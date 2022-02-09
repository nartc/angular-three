import {
  NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
  NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER,
  NGT_OBJECT_TYPE,
  NgtMaterialGeometryController,
  NgtMaterialGeometryControllerModule,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Inject,
  NgModule,
  Output,
} from '@angular/core';
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
  @Output() ready = new EventEmitter<THREE.Points>();

  constructor(
    @Inject(NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER)
    private materialGeometryController: NgtMaterialGeometryController
  ) {
    materialGeometryController.readyFn = () => {
      this.ready.emit(this.points);
    };
  }

  get points() {
    return this.materialGeometryController.object as THREE.Points;
  }
}

@NgModule({
  declarations: [NgtPoints],
  exports: [NgtPoints, NgtMaterialGeometryControllerModule],
})
export class NgtPointsModule {}
