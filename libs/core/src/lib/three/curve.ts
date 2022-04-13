import {
    Directive,
    Inject,
    Input,
    NgZone,
    Optional,
    SkipSelf,
} from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import { NGT_INSTANCE_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';

export interface NgtCommonCurveState<
    TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
> extends NgtInstanceState<TCurve> {
    arcLengthDivisions?: number;
}

@Directive()
export abstract class NgtCommonCurve<
    TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
> extends NgtInstance<TCurve, NgtCommonCurveState<TCurve>> {
    abstract get curveType(): AnyConstructor<TCurve>;

    @Input() set arcLengthDivisions(arcLengthDivisions: number) {
        this.set({ arcLengthDivisions });
    }

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction
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

    protected override postPrepare(curve: TCurve) {
        const arcLengthDivisions = this.get((s) => s.arcLengthDivisions);
        if (arcLengthDivisions != undefined) {
            curve.arcLengthDivisions = arcLengthDivisions;
        }
    }

    private readonly init = this.effect<unknown[]>(
        tapEffect((instanceArgs) => {
            this.prepareInstance(new this.curveType(...instanceArgs));
        })
    );
}
