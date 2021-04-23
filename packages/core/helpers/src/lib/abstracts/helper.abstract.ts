import type { AnyConstructor } from '@angular-three/core';
import { ThreeObject3d } from '@angular-three/core';
import { Directive, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Object3D } from 'three';

@Directive()
export abstract class ThreeHelper<THelper extends Object3D>
  extends ThreeObject3d<THelper>
  implements OnInit, OnChanges {
  abstract helperType: AnyConstructor<THelper>;

  private _extraArgs: unknown[] = [];

  private _helper!: THelper;

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (!this.object3d) {
      this.init();
    }
  }

  ngOnInit() {
    this.init();
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
