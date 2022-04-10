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
    selector: 'ngt-circle-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.CircleGeometry>(NgtCircleGeometry),
    ],
})
export class NgtCircleGeometry extends NgtCommonGeometry<THREE.CircleGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CircleGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.CircleGeometry>) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.CircleGeometry> {
        return THREE.CircleGeometry;
    }
}

@NgModule({
    declarations: [NgtCircleGeometry],
    exports: [NgtCircleGeometry],
})
export class NgtCircleGeometryModule {}
