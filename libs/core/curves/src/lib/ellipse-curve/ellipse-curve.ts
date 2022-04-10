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
    selector: 'ngt-ellipse-curve',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonCurveFactory<THREE.EllipseCurve>(NgtEllipseCurve)],
})
export class NgtEllipseCurve extends NgtCommonCurve<THREE.EllipseCurve> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.EllipseCurve>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.EllipseCurve>) {
        this.instanceArgs = v;
    }

    override get curveType(): AnyConstructor<THREE.EllipseCurve> {
        return THREE.EllipseCurve;
    }
}

@NgModule({
    declarations: [NgtEllipseCurve],
    exports: [NgtEllipseCurve],
})
export class NgtEllipseCurveModule {}
