// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-raw-shader-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.RawShaderMaterial,
            THREE.ShaderMaterialParameters
        >(NgtRawShaderMaterial),
    ],
})
export class NgtRawShaderMaterial extends NgtCommonMaterial<
    THREE.ShaderMaterialParameters,
    THREE.RawShaderMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.ShaderMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.RawShaderMaterial> {
        return THREE.RawShaderMaterial;
    }
}

@NgModule({
    declarations: [NgtRawShaderMaterial],
    exports: [NgtRawShaderMaterial],
})
export class NgtRawShaderMaterialModule {}