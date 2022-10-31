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
    selector: 'ngt-buffer-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtBufferGeometry),
        provideCommonGeometryRef(NgtBufferGeometry)
    ],
})
export class NgtBufferGeometry extends NgtCommonGeometry<THREE.BufferGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.BufferGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.BufferGeometry> {
        return THREE.BufferGeometry;
    }
}
