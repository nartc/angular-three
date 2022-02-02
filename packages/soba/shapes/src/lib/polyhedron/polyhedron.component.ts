// GENERATED
import {
  createExtenderProvider,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
  NGT_WITH_MATERIAL_WATCHED_CONTROLLER,
  NgtExtender,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtWithMaterialController,
  NgtWithMaterialControllerModule,
} from '@angular-three/core';
import { NgtPolyhedronGeometryModule } from '@angular-three/core/geometries';
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
  selector: 'ngt-soba-polyhedron',
  template: `
    <ngt-mesh
      (ready)="object = $event"
      (animateReady)="
        animateReady.emit({ entity: $any($event.object), state: $event.state })
      "
      [objectInputsController]="objectInputsController"
      [withMaterialController]="withMaterialController"
    >
      <ngt-polyhedron-geometry
        *ngIf="args; else withoutArgs"
        [args]="args"
      ></ngt-polyhedron-geometry>
      <ng-template #withoutArgs>
        <ngt-polyhedron-geometry></ngt-polyhedron-geometry>
      </ng-template>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
    createExtenderProvider(NgtSobaPolyhedron),
  ],
})
export class NgtSobaPolyhedron extends NgtExtender<THREE.Mesh> {
  @Input() args?: ConstructorParameters<typeof THREE.PolyhedronGeometry>;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController,
    @Inject(NGT_WITH_MATERIAL_WATCHED_CONTROLLER)
    public withMaterialController: NgtWithMaterialController
  ) {
    super();
  }
}

@NgModule({
  declarations: [NgtSobaPolyhedron],
  exports: [
    NgtSobaPolyhedron,
    NgtObjectInputsControllerModule,
    NgtWithMaterialControllerModule,
  ],
  imports: [NgtMeshModule, NgtPolyhedronGeometryModule, CommonModule],
})
export class NgtSobaPolyhedronModule {}
