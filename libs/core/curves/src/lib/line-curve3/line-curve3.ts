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
    selector: 'ngt-line-curve3',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonCurveFactory<THREE.LineCurve3>(NgtLineCurve3)],
})
export class NgtLineCurve3 extends NgtCommonCurve<THREE.LineCurve3> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.LineCurve3>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.LineCurve3>) {
        this.instanceArgs = v;
    }

    override get curveType(): AnyConstructor<THREE.LineCurve3> {
        return THREE.LineCurve3;
    }
}

@NgModule({
    declarations: [NgtLineCurve3],
    exports: [NgtLineCurve3],
})
export class NgtLineCurve3Module {}
