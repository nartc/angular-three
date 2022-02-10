import { Directive, Input, NgZone, OnInit, Optional } from '@angular/core';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { NgtCanvasStore } from '../stores/canvas';
import { NgtStore } from '../stores/store';
import type { AnyConstructor } from '../types';
import { NgtGeometry } from './geometry';

@Directive()
export abstract class NgtCurve<
        TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
    >
    extends NgtStore
    implements OnInit
{
    @Input() divisions?: number;

    abstract curveType: AnyConstructor<TCurve>;

    private _curveArgs: unknown[] = [];

    protected set curveArgs(v: unknown | unknown[]) {
        this._curveArgs = Array.isArray(v) ? v : [v];
        this.init();
    }

    private initSubscription?: Subscription;

    constructor(
        protected zone: NgZone,
        @Optional() protected geometryDirective: NgtGeometry,
        protected canvasStore: NgtCanvasStore
    ) {
        super();
    }

    private _curve?: TCurve;

    ngOnInit() {
        if (!this.curve) {
            this.init();
        }
    }

    private init() {
        this.zone.runOutsideAngular(() => {
            if (this.initSubscription) {
                this.initSubscription.unsubscribe();
            }

            this.initSubscription = this.onCanvasReady(
                this.canvasStore.ready$,
                () => {
                    this._curve = new this.curveType(...this._curveArgs);
                    if (this.curve && this.geometryDirective) {
                        const points = this.curve.getPoints(this.divisions);
                        this.geometryDirective.geometry.setFromPoints(
                            points as unknown as
                                | THREE.Vector3[]
                                | THREE.Vector2[]
                        );
                    }
                }
            );
        });
    }

    get curve(): TCurve | undefined {
        return this._curve;
    }
}
