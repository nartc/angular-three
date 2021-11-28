// GENERATED
import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtCoreModule,
  NgtObject3dController,
} from '@angular-three/core';
import { NgtCylinderGeometryModule } from '@angular-three/core/geometries';
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
  selector: 'ngt-soba-cylinder',
  exportAs: 'ngtSobaCylinder',
  template: `
    <ngt-mesh
      (ready)="ready.emit($event)"
      (animateReady)="animateReady.emit($event)"
      [object3dController]="object3dController"
      [material]="material?.material"
    >
      <ngt-cylinder-geometry *ngIf="args;else withoutArgs" [args]="args"></ngt-cylinder-geometry>
      <ng-template #withoutArgs>
        <ngt-cylinder-geometry></ngt-cylinder-geometry>
      </ng-template>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER],
})
export class NgtSobaCylinder extends NgtSobaExtender<THREE.Mesh> {
  @Input() args?: ConstructorParameters<typeof THREE.CylinderGeometry>;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController
  ) {
    super();
  }
}

@NgModule({
  declarations: [NgtSobaCylinder],
  exports: [NgtSobaCylinder],
  imports: [CommonModule, NgtCoreModule, NgtMeshModule, NgtCylinderGeometryModule],
})
export class NgtSobaCylinderModule {}
