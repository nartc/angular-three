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
    selector: 'ngt-line-curve',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonCurve(NgtLineCurve),
        provideCommonCurveRef(NgtLineCurve)
    ],
})
export class NgtLineCurve extends NgtCommonCurve<THREE.LineCurve> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.LineCurve>
        | undefined;

    override get curveType(): AnyConstructor<THREE.LineCurve> {
        return THREE.LineCurve;
    }
}
