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
    selector: 'ngt-buffer-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonGeometryRef(NgtBufferGeometry)],
})
export class NgtBufferGeometry extends NgtCommonGeometry<THREE.BufferGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.BufferGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.BufferGeometry>) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.BufferGeometry> {
        return THREE.BufferGeometry;
    }
}

@NgModule({
    declarations: [NgtBufferGeometry],
    exports: [NgtBufferGeometry],
})
export class NgtBufferGeometryModule {}
