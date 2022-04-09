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
    selector: 'ngt-cubic-bezier-curve3',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonCurveFactory<THREE.CubicBezierCurve3>(
            NgtCubicBezierCurve3
        ),
    ],
})
export class NgtCubicBezierCurve3 extends NgtCommonCurve<THREE.CubicBezierCurve3> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CubicBezierCurve3>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.CubicBezierCurve3>
    ) {
        this.curveArgs = v;
    }

    override get curveType(): AnyConstructor<THREE.CubicBezierCurve3> {
        return THREE.CubicBezierCurve3;
    }
}

@NgModule({
    declarations: [NgtCubicBezierCurve3],
    exports: [NgtCubicBezierCurve3],
})
export class NgtCubicBezierCurve3Module {}
