// GENERATED
import { NgtControls } from '@angular-three/controls';
import type { NgtCamera } from '@angular-three/core';
import { DestroyedService } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

@Directive({
  selector: 'ngt-drag-controls',
  exportAs: 'ngtDragControls',
  providers: [DestroyedService],
})
export class NgtDragControls extends NgtControls<DragControls> {
  @Input() objects: THREE.Object3D[] = [];

  initControls(camera: NgtCamera, renderer: THREE.WebGLRenderer): DragControls {
    return new DragControls(this.objects, camera, renderer.domElement);
  }
}
