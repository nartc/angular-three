// GENERATED

import { ThreeControls } from '@angular-three/controls';
import type { ThreeCameraAlias } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import type { WebGLRenderer } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

@Directive({
  selector: 'ngt-trackball-controls',
  exportAs: 'ngtTrackballControls',
  providers: [DestroyedService],
})
export class TrackballControlsDirective extends ThreeControls<TrackballControls> {
  initControls(
    camera: ThreeCameraAlias,
    renderer: WebGLRenderer
  ): TrackballControls {
    return new TrackballControls(camera, renderer.domElement);
  }
}
