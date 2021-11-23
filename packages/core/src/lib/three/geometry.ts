import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor, UnknownRecord } from '../models';
import { InstancesStore } from '../stores/instances.store';
import { NgtObject3d } from './object-3d';

@Directive()
export abstract class NgtGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> implements OnInit, OnDestroy
{
  @Input() ngtId?: string;
  @Output() ready = new EventEmitter<TGeometry>();

  constructor(
    @SkipSelf() protected instancesStore: InstancesStore,
    protected ngZone: NgZone,
    @Optional() protected parent?: NgtObject3d
  ) {}

  abstract geometryType: AnyConstructor<TGeometry>;

  private _extraArgs: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.geometry) {
        this.init();
      }
    });
  }

  private init() {
    // geometry has changed. reconstruct
    if (this.geometry) {
      // cleanup
      this.instancesStore.removeGeometry(this.ngtId || this.geometry.uuid);
      if (this.parent) {
        const object3d = this.parent.object3d as unknown as UnknownRecord;
        if (object3d.geometry) {
          (object3d.geometry as THREE.BufferGeometry).dispose();
        }
      }

      // reconstruct
      this.construct();
      if (this.parent) {
        const object3d = this.parent.object3d as unknown as UnknownRecord;
        object3d.geometry = this.geometry;
      }
    } else {
      this.construct();
    }
  }

  private construct() {
    this._geometry = new this.geometryType(...this._extraArgs);

    this.instancesStore.saveGeometry({
      id: this.ngtId || this.geometry.uuid,
      geometry: this._geometry,
    });

    this.ready.emit(this._geometry);
  }

  private _geometry!: TGeometry;
  get geometry(): TGeometry {
    return this._geometry;
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.geometry) {
        this.instancesStore.removeGeometry(this.ngtId || this.geometry.uuid);
        this.geometry.dispose();
      }
    });
  }
}
