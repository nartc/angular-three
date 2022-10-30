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
    selector: 'ngt-cone-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtConeGeometry),
        provideCommonGeometryRef(NgtConeGeometry)
    ],
})
export class NgtConeGeometry extends NgtCommonGeometry<THREE.ConeGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.ConeGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.ConeGeometry> {
        return THREE.ConeGeometry;
    }
}
