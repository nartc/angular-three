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
    selector: 'ngt-cone-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.ConeGeometry>(NgtConeGeometry),
    ],
})
export class NgtConeGeometry extends NgtCommonGeometry<THREE.ConeGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.ConeGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.ConeGeometry>) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.ConeGeometry> {
        return THREE.ConeGeometry;
    }
}

@NgModule({
    declarations: [NgtConeGeometry],
    exports: [NgtConeGeometry],
})
export class NgtConeGeometryModule {}
