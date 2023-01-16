import { injectNgtRef } from '@angular-three/core';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CubicBezierCurve3, Vector3 } from 'three';
import { Line2 } from 'three-stdlib';
import { NgtsLine } from '../line/line';
import { NgtsLineInputs } from '../line/line-inputs';

@Component({
    selector: 'ngts-cubic-bezier-line[start][end][midA][midB]',
    standalone: true,
    template: `
        <ngts-line
            [lineRef]="lineRef"
            [points]="get('points')"
            [color]="get('color')"
            [vertexColors]="get('vertexColors')"
            [resolution]="get('resolution')"
            [lineWidth]="get('lineWidth')"
            [alphaToCoverage]="get('alphaToCoverage')"
            [dashed]="get('dashed')"
            [dashScale]="get('dashScale')"
            [dashSize]="get('dashSize')"
            [dashOffset]="get('dashOffset')"
            [gapSize]="get('gapSize')"
            [wireframe]="get('wireframe')"
            [worldUnits]="get('worldUnits')"
        />
    `,
    imports: [NgtsLine, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsCubicBezierLine extends NgtsLineInputs {
    @Input() lineRef = injectNgtRef<Line2>();
    @Input() set start(start: Vector3 | [number, number, number]) {
        this.set({ start: start === undefined ? this.get('start') : start });
    }

    @Input() set end(end: Vector3 | [number, number, number]) {
        this.set({ end: end === undefined ? this.get('end') : end });
    }

    @Input() set midA(midA: Vector3 | [number, number, number]) {
        this.set({ midA: midA === undefined ? this.get('midA') : midA });
    }

    @Input() set midB(midB: Vector3 | [number, number, number]) {
        this.set({ midB: midB === undefined ? this.get('midB') : midB });
    }

    @Input() set segments(segments: number) {
        this.set({ segments: segments === undefined ? this.get('segments') : segments });
    }

    override initialize(): void {
        super.initialize();
        this.set({ segments: 10 });
        this.connect(
            'points',
            this.select(['start', 'end', 'midA', 'midB', 'segments'], ({ start, end, midA, midB, segments }) => {
                const startV = start instanceof Vector3 ? start : new Vector3(...start);
                const endV = end instanceof Vector3 ? end : new Vector3(...end);
                const midAV = midA instanceof Vector3 ? midA : new Vector3(...midA);
                const midBV = midB instanceof Vector3 ? midB : new Vector3(...midB);
                const interpolatedV = new CubicBezierCurve3(startV, midAV, midBV, endV).getPoints(segments);
                return interpolatedV;
            })
        );
    }
}
