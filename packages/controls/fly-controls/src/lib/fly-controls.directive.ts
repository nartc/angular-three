// GENERATED

import { ThreeControls } from '@angular-three/controls';
import type { ThreeCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import type { WebGLRenderer } from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

@Directive({
  selector: 'ngt-flyControls',
  exportAs: 'ngtFlyControls',
  providers: [DestroyedService],
})
export class FlyControlsDirective extends ThreeControls<FlyControls> {
  initControls(camera: ThreeCamera, renderer: WebGLRenderer): FlyControls {
    return new FlyControls(camera, renderer.domElement);
  }
}
