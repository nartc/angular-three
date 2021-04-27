// GENERATED

import { ThreeControls } from '@angular-three/controls';
import type { ThreeCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import type { WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Directive({
  selector: 'ngt-orbit-controls',
  exportAs: 'ngtOrbitControls',
  providers: [DestroyedService],
})
export class OrbitControlsDirective extends ThreeControls<OrbitControls> {
  initControls(camera: ThreeCamera, renderer: WebGLRenderer): OrbitControls {
    return new OrbitControls(camera, renderer.domElement);
  }
}
