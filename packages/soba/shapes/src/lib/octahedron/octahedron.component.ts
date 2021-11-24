// GENERATED
import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtCoreModule,
  NgtObject3dController,
} from '@angular-three/core';
import { NgtOctahedronGeometryModule } from '@angular-three/core/geometries';
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
  selector: 'ngt-soba-octahedron',
  exportAs: 'ngtSobaOctahedron',
  template: `
    <ngt-mesh
      (ready)="ready.emit($event)"
      (animateReady)="animateReady.emit($event)"
      [object3dController]="object3dController"
      [material]="material?.material"
    >
      <ngt-octahedron-geometry *ngIf="args;else withoutArgs" [args]="args"></ngt-octahedron-geometry>
      <ng-template #withoutArgs>
        <ngt-octahedron-geometry></ngt-octahedron-geometry>
      </ng-template>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER],
})
export class NgtSobaOctahedron extends NgtSobaExtender<THREE.Mesh> {
  @Input() args?: ConstructorParameters<typeof THREE.OctahedronGeometry>;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController
  ) {
    super();
  }
}

@NgModule({
  declarations: [NgtSobaOctahedron],
  exports: [NgtSobaOctahedron],
  imports: [CommonModule, NgtCoreModule, NgtMeshModule, NgtOctahedronGeometryModule],
})
export class NgtSobaOctahedronModule {}
