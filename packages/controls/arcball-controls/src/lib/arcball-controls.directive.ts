// GENERATED
import { NgtControls } from '@angular-three/controls';
import type { NgtCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import * as THREE from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';

@Directive({
  selector: 'ngt-arcball-controls',
  exportAs: 'ngtArcballControls',
  providers: [DestroyedService],
})
export class NgtArcballControls extends NgtControls<ArcballControls> {
  initControls(
    camera: NgtCamera,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene
  ): ArcballControls {
    return new ArcballControls(camera, renderer.domElement, scene);
  }
}
