import {
  NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
  NGT_OBJECT_POST_INIT,
  NGT_OBJECT_TYPE,
  NgtCommonMesh,
} from '@angular-three/core';
import { Directive, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-instanced-mesh',
  exportAs: 'ngtInstancedMesh',
  providers: [
    NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
    { provide: NGT_OBJECT_TYPE, useValue: THREE.InstancedMesh },
    {
      provide: NGT_OBJECT_POST_INIT,
      useValue: (object: THREE.InstancedMesh) => {
        object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      },
    },
  ],
})
export class NgtInstancedMesh extends NgtCommonMesh<THREE.InstancedMesh> {}

@NgModule({
  declarations: [NgtInstancedMesh],
  exports: [NgtInstancedMesh],
})
export class NgtInstancedMeshModule {}
