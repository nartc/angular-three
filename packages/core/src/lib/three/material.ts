import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor, NgtColor, UnknownRecord } from '../models';
import { NgtStore } from '../stores/store';
import { makeColor } from '../utils/make';

@Directive()
export abstract class NgtMaterial<
  TMaterialParameters extends THREE.MaterialParameters = THREE.MaterialParameters,
  TMaterial extends THREE.Material = THREE.Material
> implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter();

  @Input() set parameters(v: TMaterialParameters | undefined) {
    this.#parameters = v;
    if (v && this.material) {
      this.#convertColorToLinear(v);
      this.material.setValues(v);
      this.material.needsUpdate = true;
    }
  }

  get parameters(): TMaterialParameters | undefined {
    return this.#parameters;
  }

  #parameters?: TMaterialParameters;

  constructor(protected ngZone: NgZone, protected store: NgtStore) {}

  abstract materialType: AnyConstructor<TMaterial>;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.parameters) {
        this.#convertColorToLinear(this.parameters);
      }
      this.#material = new this.materialType(this.parameters);
      this.ready.emit();
    });
  }

  #material!: TMaterial;
  get material(): TMaterial {
    return this.#material;
  }

  #convertColorToLinear(parameters: TMaterialParameters) {
    if ('color' in parameters) {
      const colorParams = (parameters as UnknownRecord)['color'] as NgtColor;
      (parameters as UnknownRecord)['color'] = makeColor(colorParams);

      if (!this.store.get('linear')) {
        (
          (parameters as UnknownRecord)['color'] as THREE.Color
        ).convertSRGBToLinear();
      }
    }
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.material) {
        this.material.dispose();
      }
    });
  }
}
