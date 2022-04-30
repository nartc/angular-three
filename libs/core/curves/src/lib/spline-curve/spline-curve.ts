// GENERATED
import {
    AnyConstructor,
    NgtCommonCurve,
    provideCommonCurveRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-spline-curve',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonCurveRef(NgtSplineCurve)],
})
export class NgtSplineCurve extends NgtCommonCurve<THREE.SplineCurve> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.SplineCurve>
        | undefined;

    override get curveType(): AnyConstructor<THREE.SplineCurve> {
        return THREE.SplineCurve;
    }
}

@NgModule({
    declarations: [NgtSplineCurve],
    exports: [NgtSplineCurve],
})
export class NgtSplineCurveModule {}
