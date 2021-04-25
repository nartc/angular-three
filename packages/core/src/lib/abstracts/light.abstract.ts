import { Directive, Input, OnInit } from '@angular/core';
import { Light } from 'three';
import type { AnyConstructor } from '../typings';
import { ThreeObject3d } from './object-3d.abstract';

@Directive()
export abstract class ThreeLight<TLight extends Light = Light>
  extends ThreeObject3d<TLight>
  implements OnInit {
  abstract lightType: AnyConstructor<TLight>;

  @Input() intensity?: number;

  private _extraArgs: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _light!: TLight;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    if (this.intensity) {
      this._extraArgs[1] = this.intensity;
    }
    this._light = new this.lightType(...this._extraArgs);
  }

  get object3d(): TLight {
    return this._light;
  }
}
