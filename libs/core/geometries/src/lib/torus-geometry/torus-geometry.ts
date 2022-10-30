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
    selector: 'ngt-torus-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtTorusGeometry),
        provideCommonGeometryRef(NgtTorusGeometry)
    ],
})
export class NgtTorusGeometry extends NgtCommonGeometry<THREE.TorusGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.TorusGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.TorusGeometry> {
        return THREE.TorusGeometry;
    }
}
