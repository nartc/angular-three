// GENERATED

import { ThreeControls } from '@angular-three/controls';
import type { ThreeCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import type { WebGLRenderer } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

@Directive({
  selector: 'ngt-transformControls',
  exportAs: 'ngtTransformControls',
  providers: [DestroyedService],
})
export class TransformControlsDirective extends ThreeControls<TransformControls> {
  initControls(
    camera: ThreeCamera,
    renderer: WebGLRenderer
  ): TransformControls {
    return new TransformControls(camera, renderer.domElement);
  }
}
