// GENERATED
import {
    AnyConstructor,
    NgtCommonCurve,
    provideCommonCurveFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-quadratic-bezier-curve3',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonCurveFactory<THREE.QuadraticBezierCurve3>(
            NgtQuadraticBezierCurve3
        ),
    ],
})
export class NgtQuadraticBezierCurve3 extends NgtCommonCurve<THREE.QuadraticBezierCurve3> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.QuadraticBezierCurve3>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.QuadraticBezierCurve3>
    ) {
        this.instanceArgs = v;
    }

    override get curveType(): AnyConstructor<THREE.QuadraticBezierCurve3> {
        return THREE.QuadraticBezierCurve3;
    }
}

@NgModule({
    declarations: [NgtQuadraticBezierCurve3],
    exports: [NgtQuadraticBezierCurve3],
})
export class NgtQuadraticBezierCurve3Module {}
