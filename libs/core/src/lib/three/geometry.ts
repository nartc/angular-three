import {
    Directive,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import * as THREE from 'three';
import { NGT_OBJECT } from '../di/object';
import { NgtCanvasStore } from '../stores/canvas';
import { NgtStore, tapEffect } from '../stores/store';
import type { AnyConstructor, AnyFunction } from '../types';

interface NgtGeometryState<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
> {
    geometry: TGeometry;
    geometryArgs: unknown[];
}

@Directive()
export abstract class NgtGeometry<
        TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry
    >
    extends NgtStore<NgtGeometryState<TGeometry>>
    implements OnInit, OnDestroy
{
    @Output() ready = this.select((s) => s.geometry);

    constructor(
        protected zone: NgZone,
        protected canvasStore: NgtCanvasStore,
        @Inject(NGT_OBJECT) protected parentObjectFactory: AnyFunction
    ) {
        super();
        this.set({ geometryArgs: [] });
    }

    abstract geometryType: AnyConstructor<TGeometry>;

    protected set geometryArgs(v: unknown | unknown[]) {
        this.set({ geometryArgs: Array.isArray(v) ? v : [v] });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.init(this.select((s) => s.geometryArgs));
            });
        });
    }

    private readonly init = this.effect<
        NgtGeometryState<TGeometry>['geometryArgs']
    >(
        tapEffect((geometryArgs) => {
            const geometry = new this.geometryType(...geometryArgs);
            const parentObject = this.parentObjectFactory() as THREE.Mesh;
            if (parentObject) {
                parentObject.geometry = geometry;
            }
            this.set({ geometry });

            return () => {
                geometry.dispose();
            };
        })
    );

    get geometry(): TGeometry {
        return this.get((s) => s.geometry) as TGeometry;
    }
}
