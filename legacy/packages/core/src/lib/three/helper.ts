import { Directive, OnChanges, OnInit } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../models';
import { NgtObject3d } from './object-3d';

@Directive()
export abstract class NgtHelper<THelper extends THREE.Object3D>
  extends NgtObject3d<THelper>
  implements OnInit, OnChanges
{
  abstract helperType: AnyConstructor<THelper>;

  private _extraArgs: unknown[] = [];

  private _helper!: THelper;

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
  }

  ngOnChanges() {
    super.ngOnChanges();
    this.inputChangeHandler();
  }

  inputChangeHandler = () => {
    if (!this.object3d) {
      this.init();
    }
  };

  ngOnInit() {
    this.inputChangeHandler();
  }

  protected initObject() {
    try {
      this._helper = new this.helperType(...this._extraArgs);
    } catch (e) {
      console.log('Failed to initialize Helper');
    }
  }

  get object3d(): THelper {
    return this._helper;
  }
}
