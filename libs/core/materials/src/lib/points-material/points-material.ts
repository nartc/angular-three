// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-points-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.PointsMaterial,
            THREE.PointsMaterialParameters
        >(NgtPointsMaterial),
    ],
})
export class NgtPointsMaterial extends NgtCommonMaterial<
    THREE.PointsMaterialParameters,
    THREE.PointsMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.PointsMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.PointsMaterial> {
        return THREE.PointsMaterial;
    }
}

@NgModule({
    declarations: [NgtPointsMaterial],
    exports: [NgtPointsMaterial],
})
export class NgtPointsMaterialModule {}
