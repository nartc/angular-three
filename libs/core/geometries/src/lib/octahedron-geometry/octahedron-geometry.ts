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
    selector: 'ngt-octahedron-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.OctahedronGeometry>(
            NgtOctahedronGeometry
        ),
    ],
})
export class NgtOctahedronGeometry extends NgtCommonGeometry<THREE.OctahedronGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.OctahedronGeometry>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.OctahedronGeometry>
    ) {
        this.geometryArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.OctahedronGeometry> {
        return THREE.OctahedronGeometry;
    }
}

@NgModule({
    declarations: [NgtOctahedronGeometry],
    exports: [NgtOctahedronGeometry],
})
export class NgtOctahedronGeometryModule {}
