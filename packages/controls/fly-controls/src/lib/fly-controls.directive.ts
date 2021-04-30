// GENERATED

import { ThreeControls } from '@angular-three/controls';
import type { ThreeCameraAlias } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import type { WebGLRenderer } from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

@Directive({
  selector: 'ngt-fly-controls',
  exportAs: 'ngtFlyControls',
  providers: [DestroyedService],
})
export class FlyControlsDirective extends ThreeControls<FlyControls> {
  initControls(camera: ThreeCameraAlias, renderer: WebGLRenderer): FlyControls {
    return new FlyControls(camera, renderer.domElement);
  }
}
