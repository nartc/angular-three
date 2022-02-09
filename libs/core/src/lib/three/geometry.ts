import {
  Directive,
  EventEmitter,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { NGT_OBJECT } from '../di/object';
import { NgtCanvasStore } from '../stores/canvas';
import { NgtStore } from '../stores/store';
import type { AnyConstructor, AnyFunction } from '../types';

@Directive()
export abstract class NgtGeometry<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
  >
  extends NgtStore
  implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter<TGeometry>();

  constructor(
    protected zone: NgZone,
    @Inject(NGT_OBJECT) protected parentObjectFactory: AnyFunction,
    protected canvasStore: NgtCanvasStore
  ) {
    super();
  }

  abstract geometryType: AnyConstructor<TGeometry>;

  private _geometryArgs: unknown[] = [];
  protected set geometryArgs(v: unknown | unknown[]) {
    this._geometryArgs = Array.isArray(v) ? v : [v];
    this.init();
  }

  private initSubscription?: Subscription;

  ngOnInit() {
    if (!this.geometry) {
      this.init();
    }
  }

  private init() {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.effect<boolean>(
        tap(() => {
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
        })
      )(this.canvasStore.ready$);
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

  override ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.geometry) {
        this.geometry.dispose();
      }
    });
    super.ngOnDestroy();
  }
}
