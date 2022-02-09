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
  selector: 'ngt-line',
  exportAs: 'ngtLine',
  providers: [
    {
      provide: NgtCommonLine,
      useExisting: NgtLine,
    },
    NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
    {
      provide: NGT_OBJECT_TYPE,
      useValue: THREE.Line,
    },
  ],
})
export class NgtLine extends NgtCommonLine<THREE.Line> {}

@NgModule({
  declarations: [NgtLine],
  exports: [NgtLine, NgtMaterialGeometryControllerModule],
})
export class NgtLineModule {}
