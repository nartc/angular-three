import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtAnimationReady,
  NgtCoreModule,
  NgtObject3dController,
} from '@angular-three/core';
import { NgtGroup, NgtGroupModule } from '@angular-three/core/group';
import { NgtSobaExtender } from '@angular-three/soba';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-billboard',
  exportAs: 'ngtSobaBillboard',
  template: `
    <ngt-group
      (ready)="ready.emit($event)"
      (animateReady)="animateReady.emit($event); onAnimateReady($event)"
      [object3dController]="object3dController"
    >
      <ng-content></ng-content>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER],
})
export class NgtSobaBillboard extends NgtSobaExtender<THREE.Group> {
  @Input() follow = true;
  @Input() lockX = false;
  @Input() lockY = false;
  @Input() lockZ = false;

  @ViewChild(NgtGroup, { static: true }) group!: NgtGroup;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController
  ) {
    super();
  }

  onAnimateReady({
    animateObject,
    renderState: { camera },
  }: NgtAnimationReady<THREE.Group>) {
    if (!this.follow) return;

    // save previous rotation in case we're locking an axis
    const prevRotation = animateObject.rotation.clone();

    // always face the camera
    animateObject.quaternion.copy(camera.quaternion);

    // readjust any axis that is locked
    if (this.lockX) animateObject.rotation.x = prevRotation.x;
    if (this.lockY) animateObject.rotation.y = prevRotation.y;
    if (this.lockZ) animateObject.rotation.z = prevRotation.z;
  }
}

@NgModule({
  declarations: [NgtSobaBillboard],
  exports: [NgtSobaBillboard],
  imports: [NgtCoreModule, NgtGroupModule],
})
export class NgtSobaBillboardModule {}
