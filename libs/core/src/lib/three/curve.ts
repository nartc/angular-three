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
import { NGT_INSTANCE_FACTORY } from '../di/instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type { AnyConstructor, AnyFunction, NgtUnknownInstance } from '../types';
import { prepare } from '../utils/instance';

export interface NgtCommonCurveState<
    TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
> extends NgtInstanceState<TCurve> {
    curve: TCurve;
    curveArgs: unknown[];
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

    protected set curveArgs(v: unknown | unknown[]) {
        this.set({ curveArgs: Array.isArray(v) ? v : [v] });
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
        this.set({ curveArgs: [] });
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.select((s) => s.curveArgs));
            });
        });
        super.ngOnInit();
    }

    get curve(): TCurve {
        return this.get((s) => s.curve);
    }

    private readonly init = this.effect<
        NgtCommonCurveState<TCurve>['curveArgs']
    >(
        tapEffect((curveArgs) => {
            const curve = prepare(
                new this.curveType(...curveArgs),
                () => this.store.get(),
                this.parentInstanceFactory?.() as NgtUnknownInstance
            );

            const arcLengthDivisions = this.get((s) => s.arcLengthDivisions);
            if (arcLengthDivisions != undefined) {
                curve.arcLengthDivisions = arcLengthDivisions;
            }

            this.set({ curve, instance: curve });
            this.emitReady();
        })
    );
}
