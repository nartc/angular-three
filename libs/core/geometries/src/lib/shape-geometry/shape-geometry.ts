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
    selector: 'ngt-shape-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonGeometry(NgtShapeGeometry),
        provideCommonGeometryRef(NgtShapeGeometry)
    ],
})
export class NgtShapeGeometry extends NgtCommonGeometry<THREE.ShapeGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.ShapeGeometry>
        | undefined;

    override get geometryType(): AnyConstructor<THREE.ShapeGeometry> {
        return THREE.ShapeGeometry;
    }
}
