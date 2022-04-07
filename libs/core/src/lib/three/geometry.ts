import { Directive, Inject, NgZone, Optional, SkipSelf } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { NGT_INSTANCE_FACTORY } from '../di/instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type { AnyConstructor, AnyFunction, NgtUnknownInstance } from '../types';
import { prepare } from '../utils/instance';

export interface NgtCommonGeometryState<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtInstanceState<TGeometry> {
    geometry: TGeometry;
    geometryArgs: unknown[];
}

@Directive()
export abstract class NgtCommonGeometry<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtInstance<TGeometry, NgtCommonGeometryState<TGeometry>> {
    abstract get geometryType(): AnyConstructor<TGeometry>;

    constructor(
        zone: NgZone,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction,
        protected store: NgtStore
    ) {
        super({ zone, shouldAttach: true, parentInstanceFactory });
        this.set({ geometryArgs: [] });
    }

    protected set geometryArgs(v: unknown | unknown[]) {
        this.set({ geometryArgs: Array.isArray(v) ? v : [v] });
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.select((s) => s.geometryArgs));
            });
        });
        super.ngOnInit();
    }

    get geometry(): TGeometry {
        return this.get((s) => s.geometry);
    }

    protected override destroy() {
        if (this.geometry) {
            this.geometry.dispose();
        }
        super.destroy();
    }

    private readonly init = this.effect<
        NgtCommonGeometryState<TGeometry>['geometryArgs']
    >(
        tapEffect((geometryArgs) => {
            const geometry = prepare(
                new this.geometryType(...geometryArgs),
                () => this.store.get(),
                this.parentInstanceFactory?.() as NgtUnknownInstance
            );
            this.set({ geometry, instance: geometry });
            this.emitReady();

            return () => {
                geometry.dispose();
            };
        })
    );
}
