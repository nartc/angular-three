import {
  Directive,
  EventEmitter,
  Inject,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import {
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
} from '../controllers/object-3d.controller';
import { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonCamera<
  TCamera extends THREE.Camera = THREE.Camera
> implements OnInit
{
  @Output() ready = new EventEmitter<TCamera>();

  abstract cameraType: AnyConstructor<TCamera>;

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    protected objectController: NgtObject3dController,
    protected ngZone: NgZone
  ) {
    objectController.initFn = () => {
      this.#camera = new this.cameraType(...this.#cameraArgs);
      return this.#camera;
    };

    objectController.readyFn = () => {
      this.ready.emit(this.camera);
    };
  }

  #cameraArgs: unknown[] = [];
  protected set cameraArgs(v: unknown | unknown[]) {
    this.#cameraArgs = Array.isArray(v) ? v : [v];
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.#camera) {
        this.objectController.init();
      }
    });
  }

  #camera!: TCamera;
  get camera(): TCamera {
    return this.#camera;
  }
}
