import {
  OBJECT_3D_CONTROLLER_PROVIDER,
  ThreeObject3d,
} from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import { Bone } from 'three';

@Directive({
  selector: 'ngt-bone',
  exportAs: 'ngtBone',
  providers: [
    { provide: ThreeObject3d, useExisting: BoneDirective },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class BoneDirective extends ThreeObject3d<Bone> implements OnInit {
  private _bone!: Bone;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._bone = new Bone();
  }

  get object3d(): Bone {
    return this._bone;
  }
}
