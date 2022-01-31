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
  selector: 'ngt-line-loop',
  exportAs: 'ngtLineLoop',
  providers: [
    {
      provide: NgtCommonLine,
      useExisting: NgtLineLoop,
    },
    NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
    {
      provide: NGT_OBJECT_TYPE,
      useValue: THREE.LineLoop,
    },
  ],
})
export class NgtLineLoop extends NgtCommonLine<THREE.LineLoop> {}

@NgModule({
  declarations: [NgtLineLoop],
  exports: [NgtLineLoop, NgtMaterialGeometryControllerModule],
})
export class NgtLineLoopModule {}
