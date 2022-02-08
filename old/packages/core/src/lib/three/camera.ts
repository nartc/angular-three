import { Directive, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import * as THREE from 'three';
import {
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObjectController,
} from '../controllers/object.controller';
import type { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonCamera<
  TCamera extends THREE.Camera = THREE.Camera
> implements OnInit
{
  @Output() ready = new EventEmitter<TCamera>();

  abstract cameraType: AnyConstructor<TCamera>;

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    protected objectController: NgtObjectController
  ) {
    objectController.initFn = () => {
      return (this._camera = new this.cameraType(...this._cameraArgs));
    };

    objectController.readyFn = () => {
      this.ready.emit(this.camera);
    };
  }

  private _cameraArgs: unknown[] = [];
  protected set cameraArgs(v: unknown | unknown[]) {
    this._cameraArgs = Array.isArray(v) ? v : [v];
    this.objectController.init();
  }

  ngOnInit() {
    if (!this._camera) {
      this.objectController.init();
    }
  }

  private _camera!: TCamera;
  get camera(): TCamera {
    return this._camera;
  }
}
