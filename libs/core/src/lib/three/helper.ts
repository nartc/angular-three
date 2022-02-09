import {
  Directive,
  EventEmitter,
  Inject,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import {
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObjectController,
} from '../controllers/object.controller';
import type { AnyConstructor } from '../types';

@Directive()
export abstract class NgtHelper<THelper extends THREE.Object3D>
  implements OnInit, OnChanges
{
  @Output() ready = new EventEmitter<THelper>();

  abstract helperType: AnyConstructor<THelper>;

  private _helper!: THelper;
  private _helperArgs: unknown[] = [];
  protected set helperArgs(v: unknown | unknown[]) {
    this._helperArgs = Array.isArray(v) ? v : [v];
    this.objectController.init();
  }

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    protected objectController: NgtObjectController
  ) {
    objectController.initFn = () => {
      return (this._helper = new this.helperType(...this._helperArgs));
    };

    objectController.readyFn = () => {
      this.ready.emit(this.helper);
    };
  }

  ngOnChanges() {
    this.objectController.init();
  }

  ngOnInit() {
    if (!this._helper) {
      this.objectController.init();
    }
  }

  get helper() {
    return this._helper;
  }
}
