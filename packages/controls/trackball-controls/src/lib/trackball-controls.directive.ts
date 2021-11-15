// GENERATED
import { NgtControls } from '@angular-three/controls';
import type { NgtCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

@Directive({
  selector: 'ngt-trackball-controls',
  exportAs: 'ngtTrackballControls',
  providers: [DestroyedService],
})
export class NgtTrackballControls extends NgtControls<TrackballControls> {
  initControls(
    camera: NgtCamera,
    renderer: THREE.WebGLRenderer
  ): TrackballControls {
    return new TrackballControls(camera, renderer.domElement);
  }
}
