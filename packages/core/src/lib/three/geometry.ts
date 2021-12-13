import {
  Directive,
  EventEmitter,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
import * as THREE from 'three';
import type { AnyConstructor, AnyFunction, UnknownRecord } from '../models';
import { NGT_OBJECT_3D } from '../providers/object3d';

@Directive()
export abstract class NgtGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter();

  constructor(
    protected ngZone: NgZone,
    @Inject(NGT_OBJECT_3D) protected parentObject: AnyFunction<THREE.Object3D>
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
        const object3d = this.parentObject as unknown as UnknownRecord;
        if (object3d.geometry) {
          (object3d.geometry as THREE.BufferGeometry).dispose();
        }
      }

      // reconstruct
      this.#construct();
      this.#assign();
    } else {
      this.#construct();
      this.#assign();
    }
  }

  #assign() {
    requestAnimationFrame(() => {
      const parentObject = this.parentObject() as THREE.Mesh;
      if (parentObject) {
        parentObject.geometry = this.geometry;
      }
      this.ready.emit();
    });
  }

  #construct() {
    this.#geometry = new this.geometryType(...this.#geometryArgs);
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
