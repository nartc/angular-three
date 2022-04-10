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
    selector: 'ngt-cubic-bezier-curve',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonCurveFactory<THREE.CubicBezierCurve>(NgtCubicBezierCurve),
    ],
})
export class NgtCubicBezierCurve extends NgtCommonCurve<THREE.CubicBezierCurve> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CubicBezierCurve>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.CubicBezierCurve>) {
        this.instanceArgs = v;
    }

    override get curveType(): AnyConstructor<THREE.CubicBezierCurve> {
        return THREE.CubicBezierCurve;
    }
}

@NgModule({
    declarations: [NgtCubicBezierCurve],
    exports: [NgtCubicBezierCurve],
})
export class NgtCubicBezierCurveModule {}
