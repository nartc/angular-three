import {
  Directive,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import { NgtObject3dController } from '../controllers/object-3d.controller';
import type { AnyConstructor, UnknownRecord } from '../models';

@Directive()
export abstract class NgtGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter();

  constructor(
    protected ngZone: NgZone,
    @Optional() private parentObject: NgtObject3dController
  ) {}

  abstract geometryType: AnyConstructor<TGeometry>;

  #geometryArgs: unknown[] = [];
  protected set geometryArgs(v: unknown | unknown[]) {
    this.#geometryArgs = Array.isArray(v) ? v : [v];
    this.ngZone.runOutsideAngular(() => {
      this.#init();
    });
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.geometry) {
        this.#init();
      }
    });
  }

  #init() {
    // geometry has changed. reconstruct
    if (this.geometry) {
      // cleanup
      if (this.parentObject) {
        const object3d = this.parentObject.object3d as unknown as UnknownRecord;
        if (object3d.geometry) {
          (object3d.geometry as THREE.BufferGeometry).dispose();
        }
      }

      // reconstruct
      this.#construct();
      if (this.parentObject) {
        const object3d = this.parentObject.object3d as unknown as UnknownRecord;
        object3d.geometry = this.geometry;
      }
    } else {
      this.#construct();
    }
  }

  #construct() {
    this.#geometry = new this.geometryType(...this.#geometryArgs);
    this.ready.emit();
  }

  #geometry!: TGeometry;
  get geometry(): TGeometry {
    return this.#geometry;
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.geometry) {
        this.geometry.dispose();
      }
    });
  }
}
