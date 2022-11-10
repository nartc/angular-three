import {
  coerceBoolean,
  NgtBeforeRender,
  NgtBooleanInput,
  NgtObjectPassThrough,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-billboard',
  standalone: true,
  template: `
    <ngt-group shouldPassThroughRef [ngtObjectPassThrough]="this" (beforeRender)="onBeforeRender($event)">
      <ng-content></ng-content>
    </ngt-group>
  `,
  imports: [NgtGroup, NgtObjectPassThrough],
  providers: [
    provideNgtObject(NgtSobaBillboard),
    provideObjectRef(NgtSobaBillboard),
    provideObjectHostRef(NgtSobaBillboard),
  ],
})
export class NgtSobaBillboard extends NgtGroup {
  override isWrapper = true;

  @Input() set follow(value: NgtBooleanInput) {
    this.set({ follow: coerceBoolean(value) });
  }

  @Input() set lockX(value: NgtBooleanInput) {
    this.set({ lockX: coerceBoolean(value) });
  }

  @Input() set lockY(value: NgtBooleanInput) {
    this.set({ lockY: coerceBoolean(value) });
  }

  @Input() set lockZ(value: NgtBooleanInput) {
    this.set({ lockZ: coerceBoolean(value) });
  }

  override initialize() {
    super.initialize();
    this.set({ follow: true, lockX: false, lockY: false, lockZ: false });
  }

  onBeforeRender($event: NgtBeforeRender<THREE.Group>) {
    const { follow, lockX, lockY, lockZ } = this.getState();

    if (!follow) return;

    // save previous rotation in case we're locking an axis
    const prevRotation = $event.object.rotation.clone();

    // always face the camera
    $event.object.quaternion.copy($event.state.camera.quaternion);

    // readjust any axis that is locked
    if (lockX) $event.object.rotation.x = prevRotation.x;
    if (lockY) $event.object.rotation.y = prevRotation.y;
    if (lockZ) $event.object.rotation.z = prevRotation.z;

    if (this.beforeRender.observed) {
      this.beforeRender.emit($event);
    }
  }
}
