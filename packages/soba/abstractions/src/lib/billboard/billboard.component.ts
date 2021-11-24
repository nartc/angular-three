import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtCoreModule,
  NgtObject3dController,
  NgtRender,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtSobaExtender } from '@angular-three/soba';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-bill-board',
  exportAs: 'ngtSobaBillboard',
  template: `
    <ngt-group
      (ready)="ready.emit($event); local = $event"
      (animateReady)="
        animateReady.emit($event); onAnimateReady($event.renderState)
      "
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

  local?: THREE.Group;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController
  ) {
    super();
  }

  onAnimateReady({ camera }: NgtRender) {
    if (!this.follow || !this.local) return;

    // save previous rotation in case we're locking an axis
    const prevRotation = this.local.rotation.clone();

    // always face the camera
    this.local.quaternion.copy(camera.quaternion);

    // readjust any axis that is locked
    if (this.lockX) this.local.rotation.x = prevRotation.x;
    if (this.lockY) this.local.rotation.y = prevRotation.y;
    if (this.lockZ) this.local.rotation.z = prevRotation.z;
  }
}

@NgModule({
  declarations: [NgtSobaBillboard],
  exports: [NgtSobaBillboard],
  imports: [NgtCoreModule, NgtGroupModule],
})
export class NgtSobaBillboardModule {}
