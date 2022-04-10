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
    selector: 'ngt-dodecahedron-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.DodecahedronGeometry>(
            NgtDodecahedronGeometry
        ),
    ],
})
export class NgtDodecahedronGeometry extends NgtCommonGeometry<THREE.DodecahedronGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.DodecahedronGeometry>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.DodecahedronGeometry>
    ) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.DodecahedronGeometry> {
        return THREE.DodecahedronGeometry;
    }
}

@NgModule({
    declarations: [NgtDodecahedronGeometry],
    exports: [NgtDodecahedronGeometry],
})
export class NgtDodecahedronGeometryModule {}
