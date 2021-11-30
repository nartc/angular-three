import { Directive, Inject, NgZone, OnChanges, OnInit } from '@angular/core';
import * as THREE from 'three';
import {
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
} from '../controllers/object-3d.controller';
import { AnyConstructor } from '../models';

@Directive()
export abstract class NgtHelper<THelper extends THREE.Object3D>
  implements OnInit, OnChanges
{
  abstract helperType: AnyConstructor<THelper>;

  #helper!: THelper;
  #helperArgs: unknown[] = [];
  protected set helperArgs(v: unknown | unknown[]) {
    this.#helperArgs = Array.isArray(v) ? v : [v];
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    protected objectController: NgtObject3dController,
    protected ngZone: NgZone
  ) {}

  ngOnChanges() {
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }

  ngOnInit() {
    this.objectController.initFn = () => {
      return this.ngZone.runOutsideAngular(() => {
        this.#helper = new this.helperType(...this.#helperArgs);
        return this.#helper;
      });
    };

    this.ngZone.runOutsideAngular(() => {
      if (!this.#helper) {
        this.objectController.init();
      }
    });
  }

  get helper() {
    return this.#helper;
  }
}
