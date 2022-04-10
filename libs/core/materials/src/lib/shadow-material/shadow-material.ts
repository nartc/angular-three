// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    Input,
} from '@angular/core';
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

    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
    }

    get materialType(): AnyConstructor<THREE.ShadowMaterial> {
        return THREE.ShadowMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            color: true,
        };
    }
}

@NgModule({
    declarations: [NgtShadowMaterial],
    exports: [NgtShadowMaterial],
})
export class NgtShadowMaterialModule {}
