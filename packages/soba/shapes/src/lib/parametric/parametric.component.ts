// GENERATED
import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtCoreModule,
  NgtObject3dController,
} from '@angular-three/core';
import { NgtParametricGeometryModule } from '@angular-three/core/geometries';
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
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';

@Component({
  selector: 'ngt-soba-parametric',
  exportAs: 'ngtSobaParametric',
  template: `
    <ngt-mesh
      (ready)="ready.emit($event)"
      (animateReady)="animateReady.emit($event)"
      [object3dController]="object3dController"
    >
      <ngt-parametric-geometry *ngIf="args;else withoutArgs" [args]="args"></ngt-parametric-geometry>
      <ng-template #withoutArgs>
        <ngt-parametric-geometry></ngt-parametric-geometry>
      </ng-template>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER],
})
export class NgtSobaParametric extends NgtSobaExtender<THREE.Mesh> {
  @Input() args?: ConstructorParameters<typeof ParametricGeometry>;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController
  ) {
    super();
  }
}

@NgModule({
  declarations: [NgtSobaParametric],
  exports: [NgtSobaParametric],
  imports: [CommonModule, NgtCoreModule, NgtMeshModule, NgtParametricGeometryModule],
})
export class NgtSobaParametricModule {}
