// GENERATED
import {
  NGT_CONTENT_MATERIAL_CONTROLLER_PROVIDER,
  NGT_CONTENT_MATERIAL_WATCHED_CONTROLLER,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtContentMaterialController,
  NgtObject3dInputsController,
  NgtSobaExtender,
  NgtObject3dInputsControllerModule,
  NgtContentMaterialControllerModule,
} from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-plane',
  template: `
    <ngt-mesh
      #ngtMesh="ngtMesh"
      (ready)="object = ngtMesh.mesh"
      [object3dInputsController]="objectInputsController"
      [contentMaterialController]="contentMaterialController"
    >
      <ngt-plane-geometry
        *ngIf="args; else withoutArgs"
        [args]="args"
      ></ngt-plane-geometry>
      <ng-template #withoutArgs>
        <ngt-plane-geometry></ngt-plane-geometry>
      </ng-template>
    </ngt-mesh>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_CONTENT_MATERIAL_CONTROLLER_PROVIDER,
    { provide: NgtSobaExtender, useExisting: NgtSobaPlane },
  ],
})
export class NgtSobaPlane extends NgtSobaExtender<THREE.Mesh> {
  @Input() args?: ConstructorParameters<typeof THREE.PlaneGeometry>;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    @Inject(NGT_CONTENT_MATERIAL_WATCHED_CONTROLLER)
    public contentMaterialController: NgtContentMaterialController
  ) {
    super();
  }
}

@NgModule({
  declarations: [NgtSobaPlane],
  exports: [
    NgtSobaPlane,
    NgtObject3dInputsControllerModule,
    NgtContentMaterialControllerModule,
  ],
  imports: [NgtMeshModule, NgtPlaneGeometryModule, CommonModule],
})
export class NgtSobaPlaneModule {}
