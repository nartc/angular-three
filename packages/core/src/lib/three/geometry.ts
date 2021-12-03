import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import { NgtObject3dController } from '../controllers/object-3d.controller';
import type { AnyConstructor, UnknownRecord } from '../models';
import { NgtInstancesStore } from '../stores/instances.store';

@Directive()
export abstract class NgtGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> implements OnInit, OnDestroy
{
  @Input() ngtId?: string;
  @Output() ready = new EventEmitter();

  constructor(
    protected instancesStore: NgtInstancesStore,
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
      this.instancesStore.removeGeometry(this.ngtId || this.geometry.uuid);
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

    this.instancesStore.saveGeometry({
      id: this.ngtId || this.geometry.uuid,
      geometry: this.geometry,
    });

    this.ready.emit();
  }

  #geometry!: TGeometry;
  get geometry(): TGeometry {
    return this.#geometry;
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
