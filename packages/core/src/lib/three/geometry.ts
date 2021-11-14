import {
  Directive,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  SkipSelf,
} from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../models';
import { InstancesStore } from '../stores/instances.store';

@Directive()
export abstract class NgtGeometry<
  TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> implements OnInit, OnDestroy
{
  @Input() ngtId?: string;

  constructor(
    @SkipSelf() protected instancesStore: InstancesStore,
    protected ngZone: NgZone
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
    this._geometry = new this.geometryType(...this._extraArgs);

    this.instancesStore.saveGeometry({
      id: this.ngtId,
      geometry: this._geometry,
    });
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
