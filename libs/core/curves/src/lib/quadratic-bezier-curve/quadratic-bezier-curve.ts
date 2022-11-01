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
    selector: 'ngt-quadratic-bezier-curve',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonCurve(NgtQuadraticBezierCurve),
        provideCommonCurveRef(NgtQuadraticBezierCurve)
    ],
})
export class NgtQuadraticBezierCurve extends NgtCommonCurve<THREE.QuadraticBezierCurve> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.QuadraticBezierCurve>
        | undefined;

    override get curveType(): AnyConstructor<THREE.QuadraticBezierCurve> {
        return THREE.QuadraticBezierCurve;
    }
}
