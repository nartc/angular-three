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
    selector: 'ngt-octahedron-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtOctahedronGeometry),
        provideCommonGeometryRef(NgtOctahedronGeometry)
    ],
})
export class NgtOctahedronGeometry extends NgtCommonGeometry<THREE.OctahedronGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.OctahedronGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.OctahedronGeometry> {
        return THREE.OctahedronGeometry;
    }
}
