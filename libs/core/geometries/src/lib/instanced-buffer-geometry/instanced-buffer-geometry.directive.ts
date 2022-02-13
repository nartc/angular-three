// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-instanced-buffer-geometry',
    exportAs: 'ngtInstancedBufferGeometry',
    providers: [
        {
            provide: NgtGeometry,
            useExisting: NgtInstancedBufferGeometry,
        },
    ],
})
export class NgtInstancedBufferGeometry extends NgtGeometry<THREE.InstancedBufferGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.InstancedBufferGeometry>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.InstancedBufferGeometry>
    ) {
        this.geometryArgs = v;
    }

    geometryType = THREE.InstancedBufferGeometry;
}

@NgModule({
    declarations: [NgtInstancedBufferGeometry],
    exports: [NgtInstancedBufferGeometry],
})
export class NgtInstancedBufferGeometryModule {}
