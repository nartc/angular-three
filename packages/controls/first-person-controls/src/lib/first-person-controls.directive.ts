// GENERATED
import { NgtControls } from '@angular-three/controls';
import type { NgtCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

@Directive({
  selector: 'ngt-first-person-controls',
  exportAs: 'ngtFirstPersonControls',
  providers: [DestroyedService],
})
export class NgtFirstPersonControls extends NgtControls<FirstPersonControls> {
  initControls(
    camera: NgtCamera,
    renderer: THREE.WebGLRenderer
  ): FirstPersonControls {
    return new FirstPersonControls(camera, renderer.domElement);
  }
}
