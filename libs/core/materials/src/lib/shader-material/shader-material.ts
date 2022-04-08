// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-shader-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.ShaderMaterial,
            THREE.ShaderMaterialParameters
        >(NgtShaderMaterial),
    ],
})
export class NgtShaderMaterial extends NgtCommonMaterial<
    THREE.ShaderMaterialParameters,
    THREE.ShaderMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.ShaderMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.ShaderMaterial> {
        return THREE.ShaderMaterial;
    }
}

@NgModule({
    declarations: [NgtShaderMaterial],
    exports: [NgtShaderMaterial],
})
export class NgtShaderMaterialModule {}
