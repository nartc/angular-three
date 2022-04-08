// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-line-basic-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.LineBasicMaterial,
            THREE.LineBasicMaterialParameters
        >(NgtLineBasicMaterial),
    ],
})
export class NgtLineBasicMaterial extends NgtCommonMaterial<
    THREE.LineBasicMaterialParameters,
    THREE.LineBasicMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.LineBasicMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.LineBasicMaterial> {
        return THREE.LineBasicMaterial;
    }
}

@NgModule({
    declarations: [NgtLineBasicMaterial],
    exports: [NgtLineBasicMaterial],
})
export class NgtLineBasicMaterialModule {}
