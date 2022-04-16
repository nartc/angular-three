// GENERATED
import {
    AnyConstructor,
    NgtCommonCurve,
    provideCommonCurveRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
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

    @Input() set args(v: ConstructorParameters<typeof THREE.SplineCurve>) {
        this.instanceArgs = v;
    }

    override get curveType(): AnyConstructor<THREE.SplineCurve> {
        return THREE.SplineCurve;
    }
}

@NgModule({
    declarations: [NgtSplineCurve],
    exports: [NgtSplineCurve],
})
export class NgtSplineCurveModule {}
