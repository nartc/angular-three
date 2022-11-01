// GENERATED
import {
    AnyConstructor,
    NgtCommonCurve,
    provideNgtCommonCurve,
    provideCommonCurveRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-spline-curve',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonCurve(NgtSplineCurve),
        provideCommonCurveRef(NgtSplineCurve)
    ],
})
export class NgtSplineCurve extends NgtCommonCurve<THREE.SplineCurve> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.SplineCurve>
        | undefined;

    override get curveType(): AnyConstructor<THREE.SplineCurve> {
        return THREE.SplineCurve;
    }
}
