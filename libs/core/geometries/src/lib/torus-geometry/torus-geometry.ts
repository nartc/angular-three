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
    selector: 'ngt-torus-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.TorusGeometry>(NgtTorusGeometry),
    ],
})
export class NgtTorusGeometry extends NgtCommonGeometry<THREE.TorusGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.TorusGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.TorusGeometry>) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.TorusGeometry> {
        return THREE.TorusGeometry;
    }
}

@NgModule({
    declarations: [NgtTorusGeometry],
    exports: [NgtTorusGeometry],
})
export class NgtTorusGeometryModule {}
