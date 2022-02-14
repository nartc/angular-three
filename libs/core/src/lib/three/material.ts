import {
    Directive,
    Inject,
    Input,
    NgZone,
    OnInit,
    Optional,
    Output,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { NGT_PARENT_OBJECT } from '../di/parent-object';
import { NgtCanvasStore } from '../stores/canvas';
import { NgtStore, tapEffect } from '../stores/store';
import type {
    AnyConstructor,
    AnyFunction,
    NgtColor,
    UnknownRecord,
} from '../types';
import { makeColor } from '../utils/make';

interface NgtMaterialState<
    TMaterial extends THREE.Material = THREE.Material,
    TMaterialParameters extends THREE.MaterialParameters = THREE.MaterialParameters
> {
    material: TMaterial;
    materialParameters: TMaterialParameters;
}

@Directive()
export abstract class NgtMaterial<
        TMaterialParameters extends THREE.MaterialParameters = THREE.MaterialParameters,
        TMaterial extends THREE.Material = THREE.Material
    >
    extends NgtStore<NgtMaterialState<TMaterial, TMaterialParameters>>
    implements OnInit
{
    @Output() ready = this.select((s) => s.material);

    @Input() set parameters(v: TMaterialParameters | undefined) {
        this.set({ materialParameters: v });
    }

    get parameters(): TMaterialParameters | undefined {
        return this.get((s) => s.materialParameters);
    }

    constructor(
        protected zone: NgZone,
        protected canvasStore: NgtCanvasStore,
        @Optional()
        @Inject(NGT_PARENT_OBJECT)
        protected parentObjectFactory: AnyFunction
    ) {
        super();
    }

    abstract materialType: AnyConstructor<TMaterial>;

    get material(): TMaterial {
        return this.get((s) => s.material);
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.init();
                this.setParameters(
                    this.select(
                        this.select((s) => s.material),
                        this.select((s) => s.materialParameters),
                        (material, materialParameters) => ({
                            material,
                            materialParameters,
                        })
                    )
                );
            });
        });
    }

    private readonly init = this.effect<void>(
        tapEffect(() => {
            const material = new this.materialType();
            const parentObject = this.parentObjectFactory?.() as THREE.Mesh;
            if (parentObject) {
                if (Array.isArray(parentObject.material)) {
                    (parentObject.material as THREE.Material[]).push(material);
                } else {
                    parentObject.material = material;
                }
            }
            this.set({ material });
            return () => {
                if (material) {
                    material.dispose();
                }
            };
        })
    );

    private readonly setParameters = this.effect<
        NgtMaterialState<TMaterial, TMaterialParameters>
    >(
        tap(({ materialParameters, material }) => {
            this.convertColorToLinear(materialParameters);
            material.setValues(
                Object.assign(
                    materialParameters,
                    'uniforms' in material && 'uniforms' in materialParameters
                        ? {
                              uniforms: {
                                  ...(
                                      material as unknown as THREE.ShaderMaterial
                                  ).uniforms,
                                  ...(
                                      materialParameters as THREE.ShaderMaterialParameters
                                  ).uniforms,
                              },
                          }
                        : {}
                )
            );
            material.needsUpdate = true;
        })
    );

    private convertColorToLinear(parameters: TMaterialParameters) {
        if ('color' in parameters) {
            const colorParams = (parameters as UnknownRecord)[
                'color'
            ] as NgtColor;
            (parameters as UnknownRecord)['color'] = makeColor(colorParams);

            if (!this.canvasStore.isLinear) {
                (
                    (parameters as UnknownRecord)['color'] as THREE.Color
                ).convertSRGBToLinear();
            }
        }
    }
}
