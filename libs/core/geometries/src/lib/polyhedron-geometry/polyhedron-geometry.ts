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
    selector: 'ngt-polyhedron-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.PolyhedronGeometry>(
            NgtPolyhedronGeometry
        ),
    ],
})
export class NgtPolyhedronGeometry extends NgtCommonGeometry<THREE.PolyhedronGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.PolyhedronGeometry>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.PolyhedronGeometry>
    ) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.PolyhedronGeometry> {
        return THREE.PolyhedronGeometry;
    }
}

@NgModule({
    declarations: [NgtPolyhedronGeometry],
    exports: [NgtPolyhedronGeometry],
})
export class NgtPolyhedronGeometryModule {}
