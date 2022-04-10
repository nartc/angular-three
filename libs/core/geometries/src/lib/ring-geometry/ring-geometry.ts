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
    selector: 'ngt-ring-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.RingGeometry>(NgtRingGeometry),
    ],
})
export class NgtRingGeometry extends NgtCommonGeometry<THREE.RingGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.RingGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.RingGeometry>) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.RingGeometry> {
        return THREE.RingGeometry;
    }
}

@NgModule({
    declarations: [NgtRingGeometry],
    exports: [NgtRingGeometry],
})
export class NgtRingGeometryModule {}
