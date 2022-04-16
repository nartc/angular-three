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
    selector: 'ngt-edges-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonGeometryRef(NgtEdgesGeometry)],
})
export class NgtEdgesGeometry extends NgtCommonGeometry<THREE.EdgesGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.EdgesGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.EdgesGeometry>) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.EdgesGeometry> {
        return THREE.EdgesGeometry;
    }
}

@NgModule({
    declarations: [NgtEdgesGeometry],
    exports: [NgtEdgesGeometry],
})
export class NgtEdgesGeometryModule {}
