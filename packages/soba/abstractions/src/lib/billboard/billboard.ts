import {
  extend,
  injectNgtRef,
  NgtBeforeRender,
  NgtRef,
  NgtRendererFlags,
  NgtRxStore,
} from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Group } from 'three';

extend({ Group });

@Component({
  selector: 'ngts-billboard',
  standalone: true,
  template: `
    <ngt-group ngtCompound *ref="ref" (beforeRender)="onBeforeRender($any($event))">
      <ng-content></ng-content>
    </ngt-group>
  `,
  imports: [NgtRef],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsBillboard extends NgtRxStore {
  static [NgtRendererFlags.COMPOUND] = true;

  @Input() ref = injectNgtRef<Group>();

  @Input() set follow(follow: boolean) {
    this.set({ follow });
  }
  @Input() set lockX(lockX: boolean) {
    this.set({ lockX });
  }
  @Input() set lockY(lockY: boolean) {
    this.set({ lockY });
  }
  @Input() set lockZ(lockZ: boolean) {
    this.set({ lockZ });
  }

  override initialize() {
    super.initialize();
    this.set({ follow: true, lockX: false, lockY: false, lockZ: false });
  }

  onBeforeRender(event: NgtBeforeRender<Group>) {
    const { follow, lockX, lockY, lockZ } = this.get();
    if (!follow) return;

    // save prev rotation in case we're locking axises
    const prevRotation = event.object.rotation.clone();
    // always face the camera
    event.object.quaternion.copy(event.state.camera.quaternion);
    // readjust any axis that is locked
    if (lockX) event.object.rotation.x = prevRotation.x;
    if (lockY) event.object.rotation.y = prevRotation.y;
    if (lockZ) event.object.rotation.z = prevRotation.z;
  }
}
