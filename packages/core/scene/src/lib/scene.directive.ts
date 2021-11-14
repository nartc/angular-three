import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtObject3d,
} from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-scene',
  exportAs: 'ngtScene',
  providers: [
    { provide: NgtObject3d, useExisting: NgtScene },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtScene extends NgtObject3d<THREE.Scene> implements OnInit {
  private _scene!: THREE.Scene;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._scene = new THREE.Scene();
  }

  get object3d(): THREE.Scene {
    return this._scene;
  }
}
