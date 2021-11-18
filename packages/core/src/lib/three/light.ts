import { Directive, Input, OnInit } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor, UnknownRecord } from '../models';
import { applyProps } from '../utils/apply-props.util';
import { NgtObject3d } from './object-3d';

@Directive()
export abstract class NgtLight<TLight extends THREE.Light = THREE.Light>
  extends NgtObject3d<TLight>
  implements OnInit
{
  abstract lightType: AnyConstructor<TLight>;

  @Input() intensity?: number;
  @Input() shadow?: THREE.LightShadow;

  private _extraArgs: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
  }

  private _light!: TLight;

  ngOnInit() {
    if (!this.object3d) {
      this.init();
    }
  }

  protected initObject() {
    if (this.intensity) {
      this._extraArgs[1] = this.intensity;
    }
    this._light = new this.lightType(...this._extraArgs);
    if (this.shadow) {
      applyProps(this._light, this.shadow as unknown as UnknownRecord);
    }
  }

  get object3d(): TLight {
    return this._light;
  }
}
