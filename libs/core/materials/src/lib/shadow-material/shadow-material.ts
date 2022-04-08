// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-shadow-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.ShadowMaterial,
            THREE.ShadowMaterialParameters
        >(NgtShadowMaterial),
    ],
})
export class NgtShadowMaterial extends NgtCommonMaterial<
    THREE.ShadowMaterialParameters,
    THREE.ShadowMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.ShadowMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.ShadowMaterial> {
        return THREE.ShadowMaterial;
    }
}

@NgModule({
    declarations: [NgtShadowMaterial],
    exports: [NgtShadowMaterial],
})
export class NgtShadowMaterialModule {}
