import {
  Directive,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import { NGT_OBJECT } from '../di/object';
import { NgtCanvasStore } from '../stores/canvas';
import type { AnyConstructor, AnyFunction } from '../types';
import { zonelessRequestAnimationFrame } from '../utils/zoneless-timer';

@Directive()
export abstract class NgtGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter<TGeometry>();

  constructor(
    @Inject(NGT_OBJECT) protected parentObjectFactory: AnyFunction,
    protected canvasStore: NgtCanvasStore
  ) {}

  abstract geometryType: AnyConstructor<TGeometry>;

  private _geometryArgs: unknown[] = [];
  protected set geometryArgs(v: unknown | unknown[]) {
    this._geometryArgs = Array.isArray(v) ? v : [v];
    this.init();
  }

  ngOnInit() {
    if (!this.geometry) {
      this.init();
    }
  }

  private init() {
    this.canvasStore.onZonelessReady(() => {
      // geometry has changed. reconstruct
      if (this.geometry) {
        // cleanup
        if (this.parentObjectFactory) {
          const object3d = this.parentObjectFactory();
          if (object3d['geometry']) {
            (object3d['geometry'] as THREE.BufferGeometry).dispose();
          }
        }

        // reconstruct
        this.construct();
        this.assign();
      } else {
        this.construct();
        this.assign();
      }
    });
  }

  private assign() {
    const parentObject = this.parentObjectFactory() as THREE.Mesh;
    if (parentObject) {
      parentObject.geometry = this.geometry;
    }
  }

  private construct() {
    this.ready.emit(
      (this._geometry = new this.geometryType(...this._geometryArgs))
    );
  }

  private _geometry!: TGeometry;
  get geometry(): TGeometry {
    return this._geometry;
  }

  ngOnDestroy() {
    zonelessRequestAnimationFrame(() => {
      if (this.geometry) {
        this.geometry.dispose();
      }
    });
  }
}
