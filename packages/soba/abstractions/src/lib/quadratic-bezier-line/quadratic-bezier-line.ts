import {
    NgtCompound,
    NgtObjectCompound,
    NgtObservableInput,
    NgtVector3,
    provideInstanceRef,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';
import { SobaLine, SOBA_LINE_INPUTS } from '../line/line';

@Component({
    selector: 'ngt-soba-quadratic-bezier-line[start][end]',
    standalone: true,
    template: `
        <ngt-soba-line [objectCompound]="this" [points]="quadraticBezierPoints$">
            <ng-content></ng-content>
        </ngt-soba-line>
    `,
    imports: [SobaLine, NgtObjectCompound],
    providers: [provideInstanceRef(SobaQuadraticBezierLine, { compound: true })],
    inputs: [...NGT_INSTANCE_INPUTS, ...SOBA_LINE_INPUTS, ...NGT_OBJECT3D_INPUTS],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaQuadraticBezierLine extends NgtCompound<SobaLine> {
    @Input() set start(start: NgtObservableInput<NgtVector3>) {
        this.write({ start });
    }

    @Input() set end(end: NgtObservableInput<NgtVector3>) {
        this.write({ end });
    }

    @Input() set mid(mid: NgtObservableInput<NgtVector3>) {
        this.write({ mid });
    }

    @Input() set segments(segments: NgtObservableInput<number>) {
        this.write({ segments });
    }

    private readonly curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
    );
    private readonly v = new THREE.Vector3();

    readonly quadraticBezierPoints$: Observable<THREE.Vector3[]> = this.select(
        this.select((s) => s['start']),
        this.select((s) => s['end']),
        this.select((s) => s['mid']),
        this.select((s) => s['segments']),
        (start, end, mid, segments) => this.getPoints_(start, end, mid, segments),
        { debounce: true }
    );

    override initialize() {
        super.initialize();
        this.write({ start: [0, 0, 0], end: [0, 0, 0], segments: 20 });
        requestAnimationFrame(() => {
            (
                this.instanceRef.value as unknown as {
                    setPoints: (start: NgtVector3, end: NgtVector3, mid: NgtVector3) => void;
                }
            ).setPoints = (start, end, mid) => {
                const points = this.getPoints_(start, end, mid);
                if (this.instanceRef.value && this.instanceRef.value.geometry) {
                    this.instanceRef.value.geometry.setPositions(points.map((p) => p.toArray()).flat());
                }
            };
        });
    }

    private getPoints_(start: NgtVector3, end: NgtVector3, mid?: NgtVector3, segments = 20) {
        if (start instanceof THREE.Vector3) this.curve.v0.copy(start);
        else this.curve.v0.set(...(start as [number, number, number]));
        if (end instanceof THREE.Vector3) this.curve.v2.copy(end);
        else this.curve.v2.set(...(end as [number, number, number]));
        if (mid instanceof THREE.Vector3) {
            this.curve.v1.copy(mid);
        } else {
            this.curve.v1.copy(
                this.curve.v0
                    .clone()
                    .add(this.curve.v2.clone().sub(this.curve.v0))
                    .add(this.v.set(0, this.curve.v0.y - this.curve.v2.y, 0))
            );
        }
        return this.curve.getPoints(segments);
    }
}
