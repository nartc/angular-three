import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input, OnInit } from '@angular/core';
import { Light } from 'three';

@Directive()
export abstract class ThreeLight<
    TLight extends Light = Light,
    TLightConstructor extends typeof Light = typeof Light
  >
  extends ThreeObject3d<TLight>
  implements OnInit {
  @Input() args?: ConstructorParameters<TLightConstructor>;

  abstract lightType: TLightConstructor;

  private _light!: TLight;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._light = new this.lightType(...(this.args || [])) as TLight;
  }

  get object3d(): TLight {
    return this._light;
  }
}
