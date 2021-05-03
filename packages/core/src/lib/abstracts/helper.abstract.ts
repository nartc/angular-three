import { Directive, OnChanges, OnInit } from '@angular/core';
import { Object3D } from 'three';
import type { AnyConstructor } from '../typings';
import { ThreeObject3d } from './object-3d.abstract';

@Directive()
export abstract class ThreeHelper<THelper extends Object3D>
  extends ThreeObject3d<THelper>
  implements OnInit, OnChanges {
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
