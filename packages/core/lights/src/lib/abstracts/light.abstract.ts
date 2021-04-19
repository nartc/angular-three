import type { AnyConstructor } from '@angular-three/core';
import { ThreeObject3d } from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import { Light } from 'three';

@Directive()
export abstract class ThreeLight<TLight extends Light = Light>
  extends ThreeObject3d<TLight>
  implements OnInit {
  abstract lightType: AnyConstructor<TLight>;

  private _extraArgs: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _light!: TLight;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._light = new this.lightType(...this._extraArgs);
  }

  get object3d(): TLight {
    return this._light;
  }
}
