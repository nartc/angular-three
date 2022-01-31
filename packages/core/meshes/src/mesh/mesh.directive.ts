import {
  NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
  NGT_OBJECT_TYPE,
  NgtCommonMesh,
  NgtMaterialGeometryControllerModule,
} from '@angular-three/core';
import { Directive, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh',
  exportAs: 'ngtMesh',
  providers: [
    { provide: NgtCommonMesh, useExisting: NgtMesh },
    NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
    { provide: NGT_OBJECT_TYPE, useValue: THREE.Mesh },
  ],
})
export class NgtMesh extends NgtCommonMesh {}

@NgModule({
  declarations: [NgtMesh],
  exports: [NgtMesh, NgtMaterialGeometryControllerModule],
})
export class NgtMeshModule {}
