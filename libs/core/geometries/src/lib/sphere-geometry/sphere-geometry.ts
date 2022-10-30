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
    selector: 'ngt-sphere-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtSphereGeometry),
        provideCommonGeometryRef(NgtSphereGeometry)
    ],
})
export class NgtSphereGeometry extends NgtCommonGeometry<THREE.SphereGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.SphereGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.SphereGeometry> {
        return THREE.SphereGeometry;
    }
}
