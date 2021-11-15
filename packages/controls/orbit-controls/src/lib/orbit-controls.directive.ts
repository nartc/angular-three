// GENERATED
import { NgtControls } from '@angular-three/controls';
import type { NgtCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Directive({
  selector: 'ngt-orbit-controls',
  exportAs: 'ngtOrbitControls',
  providers: [DestroyedService],
})
export class NgtOrbitControls extends NgtControls<OrbitControls> {

  initControls(camera: NgtCamera, renderer: THREE.WebGLRenderer): OrbitControls {
    return new OrbitControls(camera, renderer.domElement);
  }
}
