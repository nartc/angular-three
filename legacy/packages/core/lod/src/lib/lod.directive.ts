import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtObject3d,
} from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-lod',
  exportAs: 'ngtLod',
  providers: [
    { provide: NgtObject3d, useExisting: NgtLod },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtLod extends NgtObject3d<THREE.LOD> implements OnInit {
  private _lod!: THREE.LOD;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._lod = new THREE.LOD();
  }

  get object3d(): THREE.LOD {
    return this._lod;
  }
}
