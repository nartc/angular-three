import { NgtInstance, NgtObservableInput, NgtVector3, NgtWrapper, provideInstanceRef } from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';
import { SobaLine } from '../line/line';

@Component({
    selector: 'ngt-soba-quadratic-bezier-line[start][end]',
    standalone: true,
    template: `
        <ngt-soba-line *wrapper="this" [points]="quadraticBezierPoints$">
            <ng-content></ng-content>
        </ngt-soba-line>
    `,
    imports: [SobaLine, NgtWrapper],
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(SobaQuadraticBezierLine)],
})
export class SobaQuadraticBezierLine extends SobaLine {
    @Input() set start(start: NgtObservableInput<NgtVector3>) {
        this.instance.write({ start });
    }

    @Input() set end(end: NgtObservableInput<NgtVector3>) {
        this.instance.write({ end });
    }

    @Input() set mid(mid: NgtObservableInput<NgtVector3>) {
        this.instance.write({ mid });
    }

    @Input() set segments(segments: NgtObservableInput<number>) {
        this.instance.write({ segments });
    }

    private readonly curve_ = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
    );
    private readonly v_ = new THREE.Vector3();

    readonly quadraticBezierPoints$: Observable<THREE.Vector3[]> = this.instance.select(
        this.instance.select((s) => s['start']),
        this.instance.select((s) => s['end']),
        this.instance.select((s) => s['mid']),
        this.instance.select((s) => s['segments']),
        (start, end, mid, segments) => this.getPoints_(start, end, mid, segments),
        { debounce: true }
    );

    constructor() {
        super();
        this.instance.write({ start: [0, 0, 0], end: [0, 0, 0], segments: 20 });
        requestAnimationFrame(() => {
            (
                this as unknown as {
                    setPoints: (start: NgtVector3, end: NgtVector3, mid: NgtVector3) => void;
                }
            ).setPoints = (start, end, mid) => {
                const points = this.getPoints_(start, end, mid);
                if (this.geometry) {
                    this.geometry.setPositions(points.map((p) => p.toArray()).flat());
                }
            };
        });
    }

    private getPoints_(start: NgtVector3, end: NgtVector3, mid?: NgtVector3, segments = 20) {
        if (start instanceof THREE.Vector3) this.curve_.v0.copy(start);
        else this.curve_.v0.set(...(start as [number, number, number]));
        if (end instanceof THREE.Vector3) this.curve_.v2.copy(end);
        else this.curve_.v2.set(...(end as [number, number, number]));
        if (mid instanceof THREE.Vector3) {
            this.curve_.v1.copy(mid);
        } else {
            this.curve_.v1.copy(
                this.curve_.v0
                    .clone()
                    .add(this.curve_.v2.clone().sub(this.curve_.v0))
                    .add(this.v_.set(0, this.curve_.v0.y - this.curve_.v2.y, 0))
            );
        }
        return this.curve_.getPoints(segments);
    }
}
