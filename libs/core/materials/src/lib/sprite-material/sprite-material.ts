// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-sprite-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.SpriteMaterial,
            THREE.SpriteMaterialParameters
        >(NgtSpriteMaterial),
    ],
})
export class NgtSpriteMaterial extends NgtCommonMaterial<
    THREE.SpriteMaterialParameters,
    THREE.SpriteMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.SpriteMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.SpriteMaterial> {
        return THREE.SpriteMaterial;
    }
}

@NgModule({
    declarations: [NgtSpriteMaterial],
    exports: [NgtSpriteMaterial],
})
export class NgtSpriteMaterialModule {}
