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
    selector: 'ngt-plane-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.PlaneGeometry>(NgtPlaneGeometry),
    ],
})
export class NgtPlaneGeometry extends NgtCommonGeometry<THREE.PlaneGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.PlaneGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.PlaneGeometry>) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.PlaneGeometry> {
        return THREE.PlaneGeometry;
    }
}

@NgModule({
    declarations: [NgtPlaneGeometry],
    exports: [NgtPlaneGeometry],
})
export class NgtPlaneGeometryModule {}
