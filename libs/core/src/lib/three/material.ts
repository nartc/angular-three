import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import { NGT_OBJECT } from '../di/object';
import { NgtCanvasStore } from '../stores/canvas';
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
  >
  extends NgtStore
  implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter<TMaterial>();

  @Input() set parameters(v: TMaterialParameters | undefined) {
    this.zone.runOutsideAngular(() => {
      this._parameters = v;
      if (v && this.material) {
        this.convertColorToLinear(v);
        this.material.setValues(
          Object.assign(
            v,
            'uniforms' in this.material && 'uniforms' in v
              ? {
                  uniforms: {
                    ...(this.material as unknown as THREE.ShaderMaterial)
                      .uniforms,
                    ...(v as THREE.ShaderMaterialParameters).uniforms,
                  },
                }
              : {}
          )
        );
        this.material.needsUpdate = true;
      }
    });
  }

  get parameters(): TMaterialParameters | undefined {
    return this._parameters;
  }

  private _parameters?: TMaterialParameters;

  constructor(
    protected zone: NgZone,
    protected canvasStore: NgtCanvasStore,
    @Inject(NGT_OBJECT) protected parentObjectFactory: AnyFunction
  ) {
    super();
  }

  abstract materialType: AnyConstructor<TMaterial>;

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.canvasStore.ready$, () => {
        if (this.parameters) {
          this.convertColorToLinear(this.parameters);
        }
        this._material = new this.materialType(this.parameters);
        const parentObject = this.parentObjectFactory() as THREE.Mesh;
        if (parentObject) {
          if (Array.isArray(parentObject.material)) {
            (parentObject.material as THREE.Material[]).push(this.material);
          } else {
            parentObject.material = this.material;
          }
        }
        this.ready.emit(this.material);
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
      (parameters as UnknownRecord)['color'] = makeColor(colorParams);

      if (!this.canvasStore.get((s) => s.linear)) {
        (
          (parameters as UnknownRecord)['color'] as THREE.Color
        ).convertSRGBToLinear();
      }
    }
  }

  override ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.material) {
        this.material.dispose();
      }
    });
    super.ngOnDestroy();
  }
}
