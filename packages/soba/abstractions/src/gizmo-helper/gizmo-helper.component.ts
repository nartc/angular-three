import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NgtCoreModule,
  NgtObject3dInputsControllerModule,
  NgtSobaExtender,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtSobaOrthographicCameraModule } from '@angular-three/soba/cameras';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import * as THREE from 'three';
import { NgtSobaGizmoHelperStore } from './gizmo-helper.store';

@Component({
  selector: 'ngt-soba-gizmo-helper',
  template: `
    <ng-container *ngIf="virtualScene$ | async as virtualScene">
      <ngt-group
        *ngIf="gizmoProps$ | async as gizmoProps"
        (ready)="onGizmoReady($event)"
        [appendTo]="virtualScene"
        [position]="[gizmoProps.x, gizmoProps.y, 0]"
        [object3dInputsController]="gizmoProps.objectInputsController"
      ></ngt-group>
      <ngt-soba-orthographic-camera
        [appendTo]="virtualScene"
        [makeDefault]="false"
        [position]="[0, 0, 200]"
        (ready)="onCameraReady($event)"
      ></ngt-soba-orthographic-camera>
      <ng-content></ng-content>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NgtSobaGizmoHelperStore,
    {
      provide: NgtSobaExtender,
      useExisting: NgtSobaGizmoHelper,
    },
  ],
})
export class NgtSobaGizmoHelper
  extends NgtSobaExtender<THREE.Group>
  implements OnInit
{
  @Input() set alignment(
    alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
  ) {
    this.sobaGizmoHelperStore.set({ alignment });
  }

  @Input() set margin(margin: [number, number]) {
    this.sobaGizmoHelperStore.set({ margin });
  }

  @Input() set renderPriority(renderPriority: number) {
    this.sobaGizmoHelperStore.set({ renderPriority });
  }

  readonly gizmoProps$ = this.sobaGizmoHelperStore.gizmoProps$;
  readonly virtualScene$ = this.sobaGizmoHelperStore.select('virtualScene');

  constructor(private sobaGizmoHelperStore: NgtSobaGizmoHelperStore) {
    super();
  }

  ngOnInit() {
    this.sobaGizmoHelperStore.actions.init();
  }

  onCameraReady(camera: THREE.OrthographicCamera) {
    this.sobaGizmoHelperStore.set({ virtualCamera: camera });
  }

  onGizmoReady(gizmo: THREE.Group) {
    this.sobaGizmoHelperStore.set({ gizmo });
    this.object = gizmo;
  }
}

@NgModule({
  declarations: [NgtSobaGizmoHelper],
  exports: [NgtSobaGizmoHelper, NgtObject3dInputsControllerModule],
  imports: [
    NgtCoreModule,
    NgtGroupModule,
    NgtSobaOrthographicCameraModule,
    CommonModule,
  ],
})
export class NgtSobaGizmoHelperModule {}
