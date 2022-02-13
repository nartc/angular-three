// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-cubic-bezier-curve',
    exportAs: 'ngtCubicBezierCurve',
    providers: [
        {
            provide: NgtCurve,
            useExisting: NgtCubicBezierCurve,
        },
    ],
})
export class NgtCubicBezierCurve extends NgtCurve<THREE.CubicBezierCurve> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CubicBezierCurve>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.CubicBezierCurve>) {
        this.curveArgs = v;
    }

    curveType = THREE.CubicBezierCurve;
}

@NgModule({
    declarations: [NgtCubicBezierCurve],
    exports: [NgtCubicBezierCurve],
})
export class NgtCubicBezierCurveModule {}
