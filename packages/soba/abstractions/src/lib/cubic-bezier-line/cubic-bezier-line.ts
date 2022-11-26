import { make, NgtInstance, NgtObservableInput, NgtVector3, NgtWrapper, provideInstanceRef } from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';
import { SobaLine } from '../line/line';

@Component({
    selector: 'ngt-soba-cubic-bezier-line[start][end][midA][midB]',
    standalone: true,
    template: `
        <ngt-soba-line *wrapper="this" [points]="cubicBezierPoints$">
            <ng-content></ng-content>
        </ngt-soba-line>
    `,
    imports: [SobaLine, NgtWrapper],
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(SobaCubicBezierLine)],
})
export class SobaCubicBezierLine extends SobaLine {
    @Input() set start(start: NgtObservableInput<NgtVector3>) {
        this.instance.write({ start });
    }

    @Input() set end(end: NgtObservableInput<NgtVector3>) {
        this.instance.write({ end });
    }

    @Input() set midA(midA: NgtObservableInput<NgtVector3>) {
        this.instance.write({ midA });
    }

    @Input() set midB(midB: NgtObservableInput<NgtVector3>) {
        this.instance.write({ midB });
    }

    @Input() set segments(segments: NgtObservableInput<number>) {
        this.instance.write({ segments });
    }

    readonly cubicBezierPoints$: Observable<ReturnType<THREE.CubicBezierCurve3['getPoints']>> = this.instance.select(
        this.instance.select((s) => s['start']),
        this.instance.select((s) => s['end']),
        this.instance.select((s) => s['midA']),
        this.instance.select((s) => s['midB']),
        this.instance.select((s) => s['segments']),
        (start, end, midA, midB, segments) => {
            const startV = start instanceof THREE.Vector3 ? start : make(THREE.Vector3, start);
            const endV = end instanceof THREE.Vector3 ? end : make(THREE.Vector3, end);
            const midAV = midA instanceof THREE.Vector3 ? midA : make(THREE.Vector3, midA);
            const midBV = midB instanceof THREE.Vector3 ? midB : make(THREE.Vector3, midB);

            return new THREE.CubicBezierCurve3(startV, midAV, midBV, endV).getPoints(segments);
        },
        { debounce: true }
    );

    constructor() {
        super();
        this.instance.write({ segments: 20 });
    }
}
