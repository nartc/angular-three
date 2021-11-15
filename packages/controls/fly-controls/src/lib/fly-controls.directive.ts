// GENERATED
import { NgtControls } from '@angular-three/controls';
import type { NgtCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

@Directive({
  selector: 'ngt-fly-controls',
  exportAs: 'ngtFlyControls',
  providers: [DestroyedService],
})
export class NgtFlyControls extends NgtControls<FlyControls> {

  initControls(camera: NgtCamera, renderer: THREE.WebGLRenderer): FlyControls {
    return new FlyControls(camera, renderer.domElement);
  }
}
