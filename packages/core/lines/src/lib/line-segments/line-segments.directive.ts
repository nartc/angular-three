// GENERATED
import {
  NgtCommonLine,
  NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
  NGT_OBJECT_TYPE,
  NgtMaterialGeometryControllerModule,
} from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-line-segments',
  exportAs: 'ngtLineSegments',
  providers: [
    {
      provide: NgtCommonLine,
      useExisting: NgtLineSegments,
    },
    NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
    {
      provide: NGT_OBJECT_TYPE,
      useValue: THREE.LineSegments,
    },
  ],
})
export class NgtLineSegments extends NgtCommonLine<THREE.LineSegments> {}

@NgModule({
  declarations: [NgtLineSegments],
  exports: [NgtLineSegments, NgtMaterialGeometryControllerModule],
})
export class NgtLineSegmentsModule {}
