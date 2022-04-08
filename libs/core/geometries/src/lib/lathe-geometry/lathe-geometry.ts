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
    selector: 'ngt-lathe-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.LatheGeometry>(NgtLatheGeometry),
    ],
})
export class NgtLatheGeometry extends NgtCommonGeometry<THREE.LatheGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.LatheGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.LatheGeometry>) {
        this.geometryArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.LatheGeometry> {
        return THREE.LatheGeometry;
    }
}

@NgModule({
    declarations: [NgtLatheGeometry],
    exports: [NgtLatheGeometry],
})
export class NgtLatheGeometryModule {}
