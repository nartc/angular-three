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
    selector: 'ngt-torus-knot-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.TorusKnotGeometry>(
            NgtTorusKnotGeometry
        ),
    ],
})
export class NgtTorusKnotGeometry extends NgtCommonGeometry<THREE.TorusKnotGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.TorusKnotGeometry>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.TorusKnotGeometry>
    ) {
        this.geometryArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.TorusKnotGeometry> {
        return THREE.TorusKnotGeometry;
    }
}

@NgModule({
    declarations: [NgtTorusKnotGeometry],
    exports: [NgtTorusKnotGeometry],
})
export class NgtTorusKnotGeometryModule {}
