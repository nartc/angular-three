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
    selector: 'ngt-cylinder-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.CylinderGeometry>(
            NgtCylinderGeometry
        ),
    ],
})
export class NgtCylinderGeometry extends NgtCommonGeometry<THREE.CylinderGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CylinderGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.CylinderGeometry>) {
        this.geometryArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.CylinderGeometry> {
        return THREE.CylinderGeometry;
    }
}

@NgModule({
    declarations: [NgtCylinderGeometry],
    exports: [NgtCylinderGeometry],
})
export class NgtCylinderGeometryModule {}
