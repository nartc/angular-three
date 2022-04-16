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
    selector: 'ngt-wireframe-geometry',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonGeometryRef(NgtWireframeGeometry)],
})
export class NgtWireframeGeometry extends NgtCommonGeometry<THREE.WireframeGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.WireframeGeometry>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.WireframeGeometry>
    ) {
        this.instanceArgs = v;
    }

    get geometryType(): AnyConstructor<THREE.WireframeGeometry> {
        return THREE.WireframeGeometry;
    }
}

@NgModule({
    declarations: [NgtWireframeGeometry],
    exports: [NgtWireframeGeometry],
})
export class NgtWireframeGeometryModule {}
