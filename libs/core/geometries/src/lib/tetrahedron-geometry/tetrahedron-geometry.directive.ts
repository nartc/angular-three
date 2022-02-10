// GENERATED
import { NGT_OBJECT_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-tetrahedron-geometry',
    exportAs: 'ngtTetrahedronGeometry',
    providers: [
        {
            provide: NgtGeometry,
            useExisting: NgtTetrahedronGeometry,
        },
        NGT_OBJECT_PROVIDER,
    ],
})
export class NgtTetrahedronGeometry extends NgtGeometry<THREE.TetrahedronGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.TetrahedronGeometry>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.TetrahedronGeometry>
    ) {
        this.geometryArgs = v;
    }

    geometryType = THREE.TetrahedronGeometry;
}

@NgModule({
    declarations: [NgtTetrahedronGeometry],
    exports: [NgtTetrahedronGeometry],
})
export class NgtTetrahedronGeometryModule {}
