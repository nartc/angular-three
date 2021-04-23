// GENERATED

import { ThreeControls } from '@angular-three/controls';
import type { ThreeCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import type { WebGLRenderer } from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

@Directive({
  selector: 'ngt-firstPersonControls',
  exportAs: 'ngtFirstPersonControls',
  providers: [DestroyedService],
})
export class FirstPersonControlsDirective extends ThreeControls<FirstPersonControls> {
  initControls(
    camera: ThreeCamera,
    renderer: WebGLRenderer
  ): FirstPersonControls {
    return new FirstPersonControls(camera, renderer.domElement);
  }
}
