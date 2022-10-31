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
    selector: 'ngt-edges-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtEdgesGeometry),
        provideCommonGeometryRef(NgtEdgesGeometry)
    ],
})
export class NgtEdgesGeometry extends NgtCommonGeometry<THREE.EdgesGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.EdgesGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.EdgesGeometry> {
        return THREE.EdgesGeometry;
    }
}
