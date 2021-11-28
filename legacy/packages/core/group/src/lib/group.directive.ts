import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtObject3d,
} from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-group',
  exportAs: 'ngtGroup',
  providers: [
    { provide: NgtObject3d, useExisting: NgtGroup },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtGroup extends NgtObject3d<THREE.Group> implements OnInit {
  private _group!: THREE.Group;

  ngOnInit() {
    this.init();
  }

  initObject() {
    this._group = new THREE.Group();
  }

  get object3d(): THREE.Group {
    return this._group;
  }
}
