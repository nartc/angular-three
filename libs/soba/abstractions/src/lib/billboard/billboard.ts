import {
  BooleanInput,
  coerceBooleanProperty,
  NgtBeforeRender,
  NgtObjectPassThrough,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-billboard',
  standalone: true,
  template: `
    <ngt-group
      [ngtObjectPassThrough]="this"
      (beforeRender)="onBeforeRender($event)"
    >
      <ng-content></ng-content>
    </ngt-group>
  `,
  imports: [NgtGroup, NgtObjectPassThrough, NgIf, NgTemplateOutlet],

  providers: [
    provideNgtObject(NgtSobaBillboard),
    provideObjectRef(NgtSobaBillboard),
    provideObjectHostRef(NgtSobaBillboard),
  ],
})
export class NgtSobaBillboard extends NgtGroup {
  override isWrapper = true;
  override shouldPassThroughRef = true;

  @Input() set follow(value: BooleanInput) {
    this.set({ follow: coerceBooleanProperty(value) });
  }

  @Input() set lockX(value: BooleanInput) {
    this.set({ lockX: coerceBooleanProperty(value) });
  }

  @Input() set lockY(value: BooleanInput) {
    this.set({ lockY: coerceBooleanProperty(value) });
  }

  @Input() set lockZ(value: BooleanInput) {
    this.set({ lockZ: coerceBooleanProperty(value) });
  }

  override preInit() {
    super.preInit();
    this.set((s) => ({
      follow: s['follow'] || true,
      lockX: s['lockX'] || false,
      lockY: s['lockY'] || false,
      lockZ: s['lockZ'] || false,
    }));
  }

  onBeforeRender($event: NgtBeforeRender<THREE.Group>) {
    const { follow, lockX, lockY, lockZ } = this.get();

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
