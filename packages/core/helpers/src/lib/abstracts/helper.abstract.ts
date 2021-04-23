import type { AnyConstructor } from '@angular-three/core';
import { ThreeObject3d } from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import { Object3D } from 'three';

@Directive()
export abstract class ThreeHelper<THelper extends Object3D>
  extends ThreeObject3d<THelper>
  implements OnInit {
  abstract helperType: AnyConstructor<THelper>;

  private _extraArgs: unknown[] = [];

  private _helper!: THelper;

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._helper = new this.helperType(...this._extraArgs);
  }

  get object3d(): THelper {
    return this._helper;
  }
}
