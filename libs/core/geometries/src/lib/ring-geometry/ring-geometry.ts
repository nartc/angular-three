// GENERATED - AngularThree v7.0.0
import {
    AnyConstructor,
    NgtCommonGeometry,
    provideNgtCommonGeometry,
    provideCommonGeometryRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-ring-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtRingGeometry),
        provideCommonGeometryRef(NgtRingGeometry)
    ],
})
export class NgtRingGeometry extends NgtCommonGeometry<THREE.RingGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.RingGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.RingGeometry> {
        return THREE.RingGeometry;
    }
}
