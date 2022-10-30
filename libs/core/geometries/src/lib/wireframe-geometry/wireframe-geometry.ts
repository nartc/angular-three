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
    selector: 'ngt-wireframe-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtWireframeGeometry),
        provideCommonGeometryRef(NgtWireframeGeometry)
    ],
})
export class NgtWireframeGeometry extends NgtCommonGeometry<THREE.WireframeGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.WireframeGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.WireframeGeometry> {
        return THREE.WireframeGeometry;
    }
}
