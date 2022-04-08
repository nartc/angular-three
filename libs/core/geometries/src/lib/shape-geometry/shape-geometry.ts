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
    selector: 'ngt-shape-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonGeometryFactory<THREE.ShapeGeometry>(NgtShapeGeometry),
    ],
})
export class NgtShapeGeometry extends NgtCommonGeometry<THREE.ShapeGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.ShapeGeometry>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.ShapeGeometry>) {
        this.geometryArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.ShapeGeometry> {
        return THREE.ShapeGeometry;
    }
}

@NgModule({
    declarations: [NgtShapeGeometry],
    exports: [NgtShapeGeometry],
})
export class NgtShapeGeometryModule {}
