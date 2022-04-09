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
    selector: 'ngt-catmull-rom-curve3',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonCurveFactory<THREE.CatmullRomCurve3>(NgtCatmullRomCurve3),
    ],
})
export class NgtCatmullRomCurve3 extends NgtCommonCurve<THREE.CatmullRomCurve3> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CatmullRomCurve3>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.CatmullRomCurve3>) {
        this.curveArgs = v;
    }

    override get curveType(): AnyConstructor<THREE.CatmullRomCurve3> {
        return THREE.CatmullRomCurve3;
    }
}

@NgModule({
    declarations: [NgtCatmullRomCurve3],
    exports: [NgtCatmullRomCurve3],
})
export class NgtCatmullRomCurve3Module {}
