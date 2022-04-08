// GENERATED
import {
    AnyConstructor,
    NgtCommonGeometry,
    provideCommonGeometryFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-tetrahedron-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.TetrahedronGeometry>(
            NgtTetrahedronGeometry
        ),
    ],
})
export class NgtTetrahedronGeometry extends NgtCommonGeometry<THREE.TetrahedronGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.TetrahedronGeometry>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.TetrahedronGeometry>
    ) {
        this.geometryArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.TetrahedronGeometry> {
        return THREE.TetrahedronGeometry;
    }
}

@NgModule({
    declarations: [NgtTetrahedronGeometry],
    exports: [NgtTetrahedronGeometry],
})
export class NgtTetrahedronGeometryModule {}
