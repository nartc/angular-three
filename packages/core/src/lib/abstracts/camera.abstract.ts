import { Directive, OnInit } from '@angular/core';
import type { Camera } from 'three';
import type { AnyConstructor } from '../typings';
import { ThreeObject3d } from './object-3d.abstract';

@Directive()
export abstract class ThreeCamera<TCamera extends Camera = Camera>
  extends ThreeObject3d<TCamera>
  implements OnInit {
  abstract cameraType: AnyConstructor<TCamera>;

  private _extraArgs: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _camera!: TCamera;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._camera = new this.cameraType(...this._extraArgs);
  }

  get object3d(): TCamera {
    return this._camera;
  }
}
