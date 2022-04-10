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
    selector: 'ngt-extrude-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.ExtrudeGeometry>(NgtExtrudeGeometry),
    ],
})
export class NgtExtrudeGeometry extends NgtCommonGeometry<THREE.ExtrudeGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.ExtrudeGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.ExtrudeGeometry>) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.ExtrudeGeometry> {
        return THREE.ExtrudeGeometry;
    }
}

@NgModule({
    declarations: [NgtExtrudeGeometry],
    exports: [NgtExtrudeGeometry],
})
export class NgtExtrudeGeometryModule {}
