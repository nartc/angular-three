// GENERATED
import {
  NGT_CONTENT_MATERIAL_CONTROLLER_PROVIDER,
  NGT_CONTENT_MATERIAL_WATCHED_CONTROLLER,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtContentMaterialController,
  NgtCoreModule,
  NgtObject3dInputsController,
} from '@angular-three/core';
import { NgtTorusGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaExtender } from '@angular-three/soba';
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
  selector: 'ngt-soba-torus',
  exportAs: 'ngtSobaTorus',
  template: `
    <ngt-mesh
      #ngtMesh="ngtMesh"
      (ready)="object = ngtMesh.mesh"
      [object3dInputsController]="objectInputsController"
      [contentMaterialController]="contentMaterialController"
    >
      <ngt-torus-geometry
        *ngIf="args; else withoutArgs"
        [args]="args"
      ></ngt-torus-geometry>
      <ng-template #withoutArgs>
        <ngt-torus-geometry></ngt-torus-geometry>
      </ng-template>
    </ngt-mesh>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_CONTENT_MATERIAL_CONTROLLER_PROVIDER,
  ],
})
export class NgtSobaTorus extends NgtSobaExtender<THREE.Mesh> {
  @Input() args?: ConstructorParameters<typeof THREE.TorusGeometry>;

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
  declarations: [NgtSobaTorus],
  exports: [NgtSobaTorus],
  imports: [NgtCoreModule, NgtMeshModule, NgtTorusGeometryModule, CommonModule],
})
export class NgtSobaTorusModule {}