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
    selector: 'ngt-torus-knot-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtTorusKnotGeometry),
        provideCommonGeometryRef(NgtTorusKnotGeometry)
    ],
})
export class NgtTorusKnotGeometry extends NgtCommonGeometry<THREE.TorusKnotGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.TorusKnotGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.TorusKnotGeometry> {
        return THREE.TorusKnotGeometry;
    }
}
