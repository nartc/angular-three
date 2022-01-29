import {
  NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
  NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER,
  NGT_OBJECT_POST_INIT,
  NGT_OBJECT_TYPE,
  NgtCommonMesh,
  NgtMaterialGeometryController,
  NgtMaterialGeometryControllerModule,
} from '@angular-three/core';
import {
  Directive,
  Inject,
  Input,
  NgModule,
  NgZone,
  Optional,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-instanced-mesh',
  exportAs: 'ngtInstancedMesh',
  providers: [
    { provide: NgtCommonMesh, useExisting: NgtInstancedMesh },
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
export class NgtInstancedMesh extends NgtCommonMesh<THREE.InstancedMesh> {
  @Input() set args(value: [number]) {
    if (this.materialGeometryController) {
      this.materialGeometryController.meshArgs = value;
    }
  }

  constructor(
    @Optional()
    @Inject(NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER)
    materialGeometryController: NgtMaterialGeometryController,
    ngZone: NgZone
  ) {
    super(materialGeometryController, ngZone);
  }
}

@NgModule({
  declarations: [NgtInstancedMesh],
  exports: [NgtInstancedMesh, NgtMaterialGeometryControllerModule],
})
export class NgtInstancedMeshModule {}
