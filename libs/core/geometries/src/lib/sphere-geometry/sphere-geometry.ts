// GENERATED
import {
    AnyConstructor,
    NgtCommonGeometry,
    provideCommonGeometryRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-sphere-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonGeometryRef(NgtSphereGeometry)],
})
export class NgtSphereGeometry extends NgtCommonGeometry<THREE.SphereGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.SphereGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.SphereGeometry>) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.SphereGeometry> {
        return THREE.SphereGeometry;
    }
}

@NgModule({
    declarations: [NgtSphereGeometry],
    exports: [NgtSphereGeometry],
})
export class NgtSphereGeometryModule {}
