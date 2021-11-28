// GENERATED
import { NgtControls } from '@angular-three/controls';
import type { NgtCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive } from '@angular/core';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

@Directive({
  selector: 'ngt-transform-controls',
  exportAs: 'ngtTransformControls',
  providers: [DestroyedService],
})
export class NgtTransformControls extends NgtControls<TransformControls> {

  initControls(camera: NgtCamera, renderer: THREE.WebGLRenderer): TransformControls {
    return new TransformControls(camera, renderer.domElement);
  }
}
