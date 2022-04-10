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
    selector: 'ngt-line-curve',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonCurveFactory<THREE.LineCurve>(NgtLineCurve)],
})
export class NgtLineCurve extends NgtCommonCurve<THREE.LineCurve> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.LineCurve>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.LineCurve>) {
        this.instanceArgs = v;
    }

    override get curveType(): AnyConstructor<THREE.LineCurve> {
        return THREE.LineCurve;
    }
}

@NgModule({
    declarations: [NgtLineCurve],
    exports: [NgtLineCurve],
})
export class NgtLineCurveModule {}
