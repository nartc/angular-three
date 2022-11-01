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
    selector: 'ngt-quadratic-bezier-curve3',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonCurve(NgtQuadraticBezierCurve3),
        provideCommonCurveRef(NgtQuadraticBezierCurve3)
    ],
})
export class NgtQuadraticBezierCurve3 extends NgtCommonCurve<THREE.QuadraticBezierCurve3> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.QuadraticBezierCurve3>
        | undefined;

    override get curveType(): AnyConstructor<THREE.QuadraticBezierCurve3> {
        return THREE.QuadraticBezierCurve3;
    }
}
