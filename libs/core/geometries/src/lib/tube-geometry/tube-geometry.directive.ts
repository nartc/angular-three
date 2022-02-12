// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-tube-geometry',
    exportAs: 'ngtTubeGeometry',
    providers: [
        {
            provide: NgtGeometry,
            useExisting: NgtTubeGeometry,
        },
    ],
})
export class NgtTubeGeometry extends NgtGeometry<THREE.TubeGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.TubeGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.TubeGeometry>) {
        this.geometryArgs = v;
    }

    geometryType = THREE.TubeGeometry;
}

@NgModule({
    declarations: [NgtTubeGeometry],
    exports: [NgtTubeGeometry],
})
export class NgtTubeGeometryModule {}
