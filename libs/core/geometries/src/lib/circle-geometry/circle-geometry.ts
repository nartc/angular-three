// GENERATED
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
    selector: 'ngt-circle-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtCircleGeometry),
        provideCommonGeometryRef(NgtCircleGeometry)
    ],
})
export class NgtCircleGeometry extends NgtCommonGeometry<THREE.CircleGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CircleGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.CircleGeometry> {
        return THREE.CircleGeometry;
    }
}
