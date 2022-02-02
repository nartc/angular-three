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
import { NgtTubeGeometryModule } from '@angular-three/core/geometries';
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
  selector: 'ngt-soba-tube',
  template: `
    <ngt-mesh
      (ready)="object = $event"
      (animateReady)="
        animateReady.emit({ entity: $any($event.object), state: $event.state })
      "
      [objectInputsController]="objectInputsController"
      [withMaterialController]="withMaterialController"
    >
      <ngt-tube-geometry
        *ngIf="args; else withoutArgs"
        [args]="args"
      ></ngt-tube-geometry>
      <ng-template #withoutArgs>
        <ngt-tube-geometry></ngt-tube-geometry>
      </ng-template>
    </ngt-mesh>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
    createExtenderProvider(NgtSobaTube),
  ],
})
export class NgtSobaTube extends NgtExtender<THREE.Mesh> {
  @Input() args?: ConstructorParameters<typeof THREE.TubeGeometry>;

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
  declarations: [NgtSobaTube],
  exports: [
    NgtSobaTube,
    NgtObjectInputsControllerModule,
    NgtWithMaterialControllerModule,
  ],
  imports: [NgtMeshModule, NgtTubeGeometryModule, CommonModule],
})
export class NgtSobaTubeModule {}
