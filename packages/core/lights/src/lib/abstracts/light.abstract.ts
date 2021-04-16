import { ThreeObject3d } from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import { Light } from 'three';

@Directive()
export abstract class ThreeLight<
    TLight extends Light = Light,
    TLightConstructor extends typeof Light = typeof Light
  >
  extends ThreeObject3d<TLight>
  implements OnInit {
  abstract lightType: TLightConstructor;

  private _extraArgs?: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _light!: TLight;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    const args = this._extraArgs;
    this._light = new this.lightType(
      ...(args as ConstructorParameters<TLightConstructor>)
    ) as TLight;
  }

  get object3d(): TLight {
    return this._light;
  }
}
