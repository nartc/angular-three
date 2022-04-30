// GENERATED
import {
    AnyConstructor,
    NgtCommonGeometry,
    provideCommonGeometryRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-plane-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonGeometryRef(NgtPlaneGeometry)],
})
export class NgtPlaneGeometry extends NgtCommonGeometry<THREE.PlaneGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.PlaneGeometry>
        | undefined;

    get geometryType(): AnyConstructor<THREE.PlaneGeometry> {
        return THREE.PlaneGeometry;
    }
}

@NgModule({
    declarations: [NgtPlaneGeometry],
    exports: [NgtPlaneGeometry],
})
export class NgtPlaneGeometryModule {}
