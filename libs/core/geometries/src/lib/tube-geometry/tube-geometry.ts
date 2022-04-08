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
    selector: 'ngt-tube-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.TubeGeometry>(NgtTubeGeometry),
    ],
})
export class NgtTubeGeometry extends NgtCommonGeometry<THREE.TubeGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.TubeGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.TubeGeometry>) {
        this.geometryArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.TubeGeometry> {
        return THREE.TubeGeometry;
    }
}

@NgModule({
    declarations: [NgtTubeGeometry],
    exports: [NgtTubeGeometry],
})
export class NgtTubeGeometryModule {}
