import { Directive, Inject, NgZone, Optional, SkipSelf } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { NGT_OBJECT_FACTORY } from '../di/object';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type { AnyConstructor, AnyFunction } from '../types';

export interface NgtCommonGeometryState<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> extends NgtInstanceState<TGeometry> {
    geometry: TGeometry;
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
        @Inject(NGT_OBJECT_FACTORY)
        parentInstanceFactory: AnyFunction,
        store: NgtStore
    ) {
        super({ zone, store, parentInstanceFactory });
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.instanceArgs$);
            });
        });
        super.ngOnInit();
    }

    get geometry(): TGeometry {
        return this.get((s) => s.geometry);
    }

    private readonly init = this.effect<unknown[]>(
        tapEffect((instanceArgs) => {
            const geometry = this.prepareInstance(
                new this.geometryType(...instanceArgs),
                'geometry'
            );

            return () => {
                geometry.dispose();
            };
        })
    );
}
