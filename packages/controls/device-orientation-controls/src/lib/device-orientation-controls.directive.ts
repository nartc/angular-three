// GENERATED

import { ThreeControls } from '@angular-three/controls';
import type { ThreeCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls';

@Directive({
  selector: 'ngt-deviceOrientationControls',
  exportAs: 'ngtDeviceOrientationControls',
  providers: [DestroyedService],
})
export class DeviceOrientationControlsDirective extends ThreeControls<DeviceOrientationControls> {
  initControls(camera: ThreeCamera): DeviceOrientationControls {
    return new DeviceOrientationControls(camera);
  }
}
