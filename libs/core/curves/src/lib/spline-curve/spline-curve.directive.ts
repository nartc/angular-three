// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-spline-curve',
    exportAs: 'ngtSplineCurve',
    providers: [
        {
            provide: NgtCurve,
            useExisting: NgtSplineCurve,
        },
    ],
})
export class NgtSplineCurve extends NgtCurve<THREE.SplineCurve> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.SplineCurve>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.SplineCurve>) {
        this.curveArgs = v;
    }

    curveType = THREE.SplineCurve;
}

@NgModule({
    declarations: [NgtSplineCurve],
    exports: [NgtSplineCurve],
})
export class NgtSplineCurveModule {}
