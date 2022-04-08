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
    selector: 'ngt-box-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.BoxGeometry>(NgtBoxGeometry),
    ],
})
export class NgtBoxGeometry extends NgtCommonGeometry<THREE.BoxGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.BoxGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.BoxGeometry>) {
        this.geometryArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.BoxGeometry> {
        return THREE.BoxGeometry;
    }
}

@NgModule({
    declarations: [NgtBoxGeometry],
    exports: [NgtBoxGeometry],
})
export class NgtBoxGeometryModule {}
