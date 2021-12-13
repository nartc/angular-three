import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
import * as THREE from 'three';
import { NgtContentMaterialController } from '../controllers/content-material.controller';
import { NGT_OBJECT_3D } from '../di/object3d';
import { NgtStore } from '../stores/store';
import type {
  AnyConstructor,
  AnyFunction,
  NgtColor,
  UnknownRecord,
} from '../types';
import { makeColor } from '../utils/make';

@Directive()
export abstract class NgtMaterial<
  TMaterialParameters extends THREE.MaterialParameters = THREE.MaterialParameters,
  TMaterial extends THREE.Material = THREE.Material
> implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter();

  @Input() set parameters(v: TMaterialParameters | undefined) {
    requestAnimationFrame(() => {
      this.#parameters = v;
      if (v && this.material) {
        this.#convertColorToLinear(v);
        this.material.setValues(v);
        this.material.needsUpdate = true;
      }
    });
  }

  get parameters(): TMaterialParameters | undefined {
    return this.#parameters;
  }

  #parameters?: TMaterialParameters;

  constructor(
    protected ngZone: NgZone,
    protected store: NgtStore,
    @Inject(NGT_OBJECT_3D) protected parentObject: AnyFunction<THREE.Object3D>,
    @Optional()
    protected contentMaterialController: NgtContentMaterialController
  ) {}

  abstract materialType: AnyConstructor<TMaterial>;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.parameters) {
        this.#convertColorToLinear(this.parameters);
      }
      this.#material = new this.materialType(this.parameters);
      requestAnimationFrame(() => {
        const parentObject = this.parentObject() as THREE.Mesh;
        if (parentObject) {
          if (
            this.contentMaterialController &&
            this.contentMaterialController.isMaterialArray
          ) {
            if (!Array.isArray(parentObject.material)) {
              parentObject.material = [];
            }
            (parentObject.material as THREE.Material[]).push(this.material);
          } else {
            parentObject.material = this.material;
          }
        }
        this.ready.emit();
      });
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
