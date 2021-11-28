import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtObject3d,
} from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-bone',
  exportAs: 'ngtBone',
  providers: [
    { provide: NgtObject3d, useExisting: NgtBone },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtBone extends NgtObject3d<THREE.Bone> implements OnInit {
  private _bone!: THREE.Bone;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._bone = new THREE.Bone();
  }

  get object3d(): THREE.Bone {
    return this._bone;
  }
}
