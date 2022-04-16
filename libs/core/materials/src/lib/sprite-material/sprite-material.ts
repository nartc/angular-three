// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    Input,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-sprite-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonMaterialRef(NgtSpriteMaterial)],
})
export class NgtSpriteMaterial extends NgtCommonMaterial<
    THREE.SpriteMaterialParameters,
    THREE.SpriteMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.SpriteMaterialParameters
        | undefined;

    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
    }

    @Input() set map(map: THREE.Texture | null) {
        this.set({ map });
    }

    @Input() set alphaMap(alphaMap: THREE.Texture | null) {
        this.set({ alphaMap });
    }

    @Input() set rotation(rotation: number) {
        this.set({ rotation });
    }

    @Input() set sizeAttenuation(sizeAttenuation: boolean) {
        this.set({ sizeAttenuation });
    }

    get materialType(): AnyConstructor<THREE.SpriteMaterial> {
        return THREE.SpriteMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            color: true,
            map: true,
            alphaMap: true,
            rotation: true,
            sizeAttenuation: true,
        };
    }
}

@NgModule({
    declarations: [NgtSpriteMaterial],
    exports: [NgtSpriteMaterial],
})
export class NgtSpriteMaterialModule {}
