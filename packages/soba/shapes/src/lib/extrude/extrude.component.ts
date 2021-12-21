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
import { NgtExtrudeGeometryModule } from '@angular-three/core/geometries';
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
  selector: 'ngt-soba-extrude',
  template: `
    <ngt-mesh
      #ngtMesh="ngtMesh"
      (ready)="object = ngtMesh.mesh"
      [object3dInputsController]="objectInputsController"
      [contentMaterialController]="contentMaterialController"
    >
      <ngt-extrude-geometry
        *ngIf="args; else withoutArgs"
        [args]="args"
      ></ngt-extrude-geometry>
      <ng-template #withoutArgs>
        <ngt-extrude-geometry></ngt-extrude-geometry>
      </ng-template>
    </ngt-mesh>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_CONTENT_MATERIAL_CONTROLLER_PROVIDER,
    { provide: NgtSobaExtender, useExisting: NgtSobaExtrude },
  ],
})
export class NgtSobaExtrude extends NgtSobaExtender<THREE.Mesh> {
  @Input() args?: ConstructorParameters<typeof THREE.ExtrudeGeometry>;

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
  declarations: [NgtSobaExtrude],
  exports: [
    NgtSobaExtrude,
    NgtObject3dInputsControllerModule,
    NgtContentMaterialControllerModule,
  ],
  imports: [NgtMeshModule, NgtExtrudeGeometryModule, CommonModule],
})
export class NgtSobaExtrudeModule {}
