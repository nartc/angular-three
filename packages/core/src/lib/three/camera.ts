import { Directive, OnInit } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../models';
import { NgtObject3d } from './object-3d';

@Directive()
export abstract class NgtCommonCamera<
    TCamera extends THREE.Camera = THREE.Camera
  >
  extends NgtObject3d<TCamera>
  implements OnInit
{
  abstract cameraType: AnyConstructor<TCamera>;

  private _extraArgs: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
  }

  private _camera!: TCamera;

  ngOnInit() {
    if (!this.object3d) {
      this.init();
    }
  }

  protected initObject() {
    this._camera = new this.cameraType(...this._extraArgs);
  }

  get object3d(): TCamera {
    return this._camera;
  }
}
