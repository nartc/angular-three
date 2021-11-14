import {
  Directive,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  SkipSelf,
} from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor, NgtColor, UnknownRecord } from '../models';
import { CanvasStore } from '../stores/canvas.store';
import { InstancesStore } from '../stores/instances.store';

@Directive()
export abstract class NgtMaterial<
  TMaterial extends THREE.Material = THREE.Material,
  TMaterialParameters extends THREE.MaterialParameters = THREE.MaterialParameters
> implements OnInit, OnDestroy
{
  @Input() ngtId?: string;

  @Input() set parameters(v: TMaterialParameters | undefined) {
    this._parameters = v;
    if (v && this.material) {
      this.ngZone.runOutsideAngular(() => {
        this.convertColorToLinear(v);
        this.material.setValues(v);
        this.material.needsUpdate = true;
      });
    }
  }

  get parameters(): TMaterialParameters | undefined {
    return this._parameters;
  }

  private _parameters?: TMaterialParameters;

  protected constructor(
    protected ngZone: NgZone,
    @SkipSelf() protected instancesStore: InstancesStore,
    @SkipSelf() protected canvasStore: CanvasStore
  ) {}

  abstract materialType: AnyConstructor<TMaterial>;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.parameters) {
        this.convertColorToLinear(this.parameters);
      }
      this._material = new this.materialType(this.parameters);
      this.instancesStore.saveMaterial({
        id: this.ngtId,
        material: this._material,
      });
    });
  }

  private _material!: TMaterial;
  get material(): TMaterial {
    return this._material;
  }

  private convertColorToLinear(parameters: TMaterialParameters) {
    if ('color' in parameters) {
      const colorParams = (parameters as UnknownRecord)['color'] as NgtColor;
      (parameters as UnknownRecord)['color'] = Array.isArray(colorParams)
        ? new THREE.Color(...colorParams)
        : new THREE.Color(colorParams);

      if (!this.canvasStore.getImperativeState().isLinear) {
        (
          (parameters as UnknownRecord)['color'] as THREE.Color
        ).convertSRGBToLinear();
      }
    }
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.material) {
        this.instancesStore.removeMaterial(this.ngtId || this.material.uuid);
        this.material.dispose();
      }
    });
  }
}
