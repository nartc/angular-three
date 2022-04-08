// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-line-dashed-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.LineDashedMaterial,
            THREE.LineDashedMaterialParameters
        >(NgtLineDashedMaterial),
    ],
})
export class NgtLineDashedMaterial extends NgtCommonMaterial<
    THREE.LineDashedMaterialParameters,
    THREE.LineDashedMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.LineDashedMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.LineDashedMaterial> {
        return THREE.LineDashedMaterial;
    }
}

@NgModule({
    declarations: [NgtLineDashedMaterial],
    exports: [NgtLineDashedMaterial],
})
export class NgtLineDashedMaterialModule {}
