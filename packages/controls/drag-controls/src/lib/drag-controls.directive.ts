// GENERATED

import { ThreeControls } from '@angular-three/controls';
import type { ThreeCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import type { WebGLRenderer, Object3D } from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

@Directive({
  selector: 'ngt-dragControls',
  exportAs: 'ngtDragControls',
  providers: [DestroyedService],
})
export class DragControlsDirective extends ThreeControls<DragControls> {
  @Input() objects: Object3D[] = [];

  initControls(camera: ThreeCamera, renderer: WebGLRenderer): DragControls {
    return new DragControls(this.objects, camera, renderer.domElement);
  }
}
