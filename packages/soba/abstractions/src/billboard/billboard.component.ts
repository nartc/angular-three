import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtRender,
  NgtSobaExtender,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-billboard',
  template: `
    <ngt-group
      #ngtGroup="ngtGroup"
      (ready)="onGroupReady(ngtGroup.group!)"
      (animateReady)="onGroupAnimate(ngtGroup.group!, $event)"
      [object3dInputsController]="objectInputsController"
    >
      <ng-content></ng-content>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    { provide: NgtSobaExtender, useExisting: NgtSobaBillboard },
  ],
})
export class NgtSobaBillboard extends NgtSobaExtender<THREE.Group> {
  @Input() follow = true;
  @Input() lockX = false;
  @Input() lockY = false;
  @Input() lockZ = false;

  @ContentChild(NgtObject3dInputsController)
  childInputsController?: NgtObject3dInputsController;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController
  ) {
    super();
  }

  onGroupAnimate(group: THREE.Group, $event: NgtRender) {
    if (!this.follow) return;

    this.animateReady.emit($event);

    // save previous rotation in case we're locking an axis
    const prevRotation = group.rotation.clone();

    // always face the camera
    group.quaternion.copy($event.camera.quaternion);

    // readjust any axis that is locked
    if (this.lockX) group.rotation.x = prevRotation.x;
    if (this.lockY) group.rotation.y = prevRotation.y;
    if (this.lockZ) group.rotation.z = prevRotation.z;
  }

  onGroupReady(group: THREE.Group) {
    this.object = group;
    if (this.childInputsController) {
      this.childInputsController.appendTo = group;
    }
  }
}

@NgModule({
  declarations: [NgtSobaBillboard],
  exports: [NgtSobaBillboard, NgtObject3dInputsControllerModule],
  imports: [NgtGroupModule],
})
export class NgtSobaBillboardModule {}
