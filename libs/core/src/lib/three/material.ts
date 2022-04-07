import {
    Directive,
    Inject,
    Input,
    NgZone,
    Optional,
    SkipSelf,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { NGT_INSTANCE_FACTORY } from '../di/instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type { AnyConstructor, AnyFunction, NgtUnknownInstance } from '../types';
import { prepare } from '../utils/instance';

export interface NgtCommonMaterialState<
    TMaterialParameters extends THREE.MaterialParameters = THREE.MaterialParameters,
    TMaterial extends THREE.Material = THREE.Material
> extends NgtInstanceState<TMaterial> {
    material: TMaterial;
    materialParameters: TMaterialParameters;
}

@Directive()
export abstract class NgtCommonMaterial<
    TMaterialParameters extends THREE.MaterialParameters = THREE.MaterialParameters,
    TMaterial extends THREE.Material = THREE.Material
> extends NgtInstance<
    TMaterial,
    NgtCommonMaterialState<TMaterialParameters, TMaterial>
> {
    @Input() set parameters(v: TMaterialParameters | undefined) {
        this.set({ materialParameters: v });
    }

    get parameters(): TMaterialParameters | undefined {
        return this.get((s) => s.materialParameters);
    }

    abstract get materialType(): AnyConstructor<TMaterial>;

    get material(): TMaterial {
        return this.get((s) => s.material);
    }

    constructor(
        zone: NgZone,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction,
        protected store: NgtStore
    ) {
        super({ zone, shouldAttach: true, parentInstanceFactory });
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
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
        super.ngOnInit();
    }

    protected override destroy() {
        if (this.material) {
            this.material.dispose();
        }
        super.destroy();
    }

    private readonly init = this.effect<void>(
        tapEffect(() => {
            const material = prepare(
                new this.materialType(),
                () => this.store.get(),
                this.parentInstanceFactory?.() as NgtUnknownInstance
            );

            this.set({ material, instance: material });
            this.emitReady();

            return () => {
                material.dispose();
            };
        })
    );

    private readonly setParameters = this.effect<
        Pick<
            NgtCommonMaterialState<TMaterialParameters, TMaterial>,
            'material' | 'materialParameters'
        >
    >(
        tap(({ materialParameters, material }) => {
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
}
