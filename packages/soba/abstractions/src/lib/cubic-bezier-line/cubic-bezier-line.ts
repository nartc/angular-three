import {
    make,
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
    selector: 'ngt-soba-cubic-bezier-line[start][end][midA][midB]',
    standalone: true,
    template: `
        <ngt-soba-line [objectCompound]="this" [points]="cubicBezierPoints$">
            <ng-content></ng-content>
        </ngt-soba-line>
    `,
    imports: [SobaLine, NgtObjectCompound],
    providers: [provideInstanceRef(SobaCubicBezierLine, { compound: true })],
    inputs: [...NGT_INSTANCE_INPUTS, ...SOBA_LINE_INPUTS, ...NGT_OBJECT3D_INPUTS],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaCubicBezierLine extends NgtCompound<SobaLine> {
    @Input() set start(start: NgtObservableInput<NgtVector3>) {
        this.write({ start });
    }

    @Input() set end(end: NgtObservableInput<NgtVector3>) {
        this.write({ end });
    }

    @Input() set midA(midA: NgtObservableInput<NgtVector3>) {
        this.write({ midA });
    }

    @Input() set midB(midB: NgtObservableInput<NgtVector3>) {
        this.write({ midB });
    }

    @Input() set segments(segments: NgtObservableInput<number>) {
        this.write({ segments });
    }

    readonly cubicBezierPoints$: Observable<ReturnType<THREE.CubicBezierCurve3['getPoints']>> = this.select(
        this.select((s) => s['start']),
        this.select((s) => s['end']),
        this.select((s) => s['midA']),
        this.select((s) => s['midB']),
        this.select((s) => s['segments']),
        (start, end, midA, midB, segments) => {
            const startV = start instanceof THREE.Vector3 ? start : make(THREE.Vector3, start);
            const endV = end instanceof THREE.Vector3 ? end : make(THREE.Vector3, end);
            const midAV = midA instanceof THREE.Vector3 ? midA : make(THREE.Vector3, midA);
            const midBV = midB instanceof THREE.Vector3 ? midB : make(THREE.Vector3, midB);

            return new THREE.CubicBezierCurve3(startV, midAV, midBV, endV).getPoints(segments);
        },
        { debounce: true }
    );

    override initialize() {
        super.initialize();
        this.write({ segments: 20 });
    }
}
