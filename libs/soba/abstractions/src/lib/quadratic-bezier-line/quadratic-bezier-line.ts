import {
    coerceNumberProperty,
    is,
    NgtObjectPassThroughModule,
    NgtTriple,
    NumberInput,
    provideObjectHostRef,
    startWithUndefined,
} from '@angular-three/core';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaLine, NgtSobaLineModule } from '../line/line';

const v = new THREE.Vector3();

@Component({
    selector: 'ngt-soba-quadratic-bezier-line',
    template: `
        <ngt-soba-line
            *ngIf="quadraticLineViewModel$ | async as quadraticLineViewModel"
            (beforeRender)="beforeRender.emit($event)"
            [points]="quadraticLineViewModel.points"
            [vertexColors]="quadraticLineViewModel.vertexColors"
            [resolution]="quadraticLineViewModel.resolution"
            [dashed]="quadraticLineViewModel.dashed"
            [color]="quadraticLineViewModel.color"
            [lineWidth]="quadraticLineViewModel.lineWidth"
            [ngtObjectOutputs]="this"
            [ngtObjectInputs]="this"
        >
            <ng-container *ngIf="content">
                <ng-template ngt-soba-line-content let-line="line">
                    <ng-container
                        [ngTemplateOutlet]="content.templateRef"
                        [ngTemplateOutletContext]="{line}"
                    ></ng-container>
                </ng-template>
            </ng-container>
        </ngt-soba-line>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideObjectHostRef(NgtSobaQuadraticBezierLine)],
})
export class NgtSobaQuadraticBezierLine extends NgtSobaLine {
    @Input() set start(start: THREE.Vector3 | NgtTriple) {
        this.set({ start });
    }

    @Input() set end(end: THREE.Vector3 | NgtTriple) {
        this.set({ end });
    }

    @Input() set mid(mid: THREE.Vector3 | NgtTriple) {
        this.set({ mid });
    }

    @Input() set segments(segments: NumberInput) {
        this.set({ segments: coerceNumberProperty(segments) });
    }

    override shouldPassThroughRef = false;

    readonly quadraticBezierPoints$ = this.select(
        this.select((s) => s['start']),
        this.select((s) => s['end']),
        this.select((s) => s['mid']).pipe(startWithUndefined()),
        this.select((s) => s['segments']),
        (start, end, mid, segments) => {
            return this.getPoints(start, end, mid, segments);
        }
    );

    readonly quadraticLineViewModel$ = this.select(
        this.quadraticBezierPoints$,
        this.select((s) => s.vertexColors),
        this.select((s) => s.resolution),
        this.select((s) => s.dashed),
        this.select((s) => s.color),
        this.select((s) => s.lineWidth),
        (points, vertexColors, resolution, dashed, color, lineWidth) => ({
            points,
            vertexColors,
            resolution,
            dashed,
            color,
            lineWidth,
        })
    );

    protected override preInit() {
        super.preInit();
        this.set((state) => ({
            start: state['start'] ?? [0, 0, 0],
            end: state['end'] ?? [0, 0, 0],
            segments: state['segments'] ?? 20,
        }));
    }

    protected override postInit() {
        super.postInit();
        this.setLineSetPoints(this.instance);
    }

    private readonly setLineSetPoints = this.effect<{}>(
        tap(() => {
            const lineRef = this.get((s) => s.instance);
            if (lineRef.value) {
                (
                    lineRef.value as unknown as {
                        setPoints: (
                            start: THREE.Vector3 | NgtTriple,
                            end: THREE.Vector3 | NgtTriple,
                            mid: THREE.Vector3 | NgtTriple
                        ) => void;
                    }
                ).setPoints = (start, end, mid) => {
                    const points = this.getPoints(start, end, mid);
                    if (lineRef.value.geometry) {
                        lineRef.value.geometry.setPositions(
                            points.map((p) => p.toArray()).flat()
                        );
                    }
                };
            }
        })
    );

    private curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
    );

    private getPoints(
        start: THREE.Vector3 | NgtTriple,
        end: THREE.Vector3 | NgtTriple,
        mid?: THREE.Vector3 | NgtTriple,
        segments = 20
    ): THREE.Vector3[] {
        if (is.vector3(start)) this.curve.v0.copy(start);
        else this.curve.v0.set(...start);
        if (is.vector3(end)) this.curve.v2.copy(end);
        else this.curve.v2.set(...end);
        if (is.vector3(mid)) {
            this.curve.v1.copy(mid);
        } else {
            this.curve.v1.copy(
                this.curve.v0
                    .clone()
                    .add(this.curve.v2.clone().sub(this.curve.v0))
                    .add(v.set(0, this.curve.v0.y - this.curve.v2.y, 0))
            );
        }
        return this.curve.getPoints(segments);
    }
}

@NgModule({
    declarations: [NgtSobaQuadraticBezierLine],
    exports: [NgtSobaQuadraticBezierLine],
    imports: [NgtSobaLineModule, NgtObjectPassThroughModule, CommonModule],
})
export class NgtSobaQuadraticBezierLineModule {}
