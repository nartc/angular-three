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

    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
    }

    @Input() set map(map: THREE.Texture | null) {
        this.set({ map });
    }

    @Input() set alphaMap(alphaMap: THREE.Texture | null) {
        this.set({ alphaMap });
    }

    @Input() set size(size: number) {
        this.set({ size });
    }

    @Input() set sizeAttenuation(sizeAttenuation: boolean) {
        this.set({ sizeAttenuation });
    }

    get materialType(): AnyConstructor<THREE.PointsMaterial> {
        return THREE.PointsMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            color: true,
            map: true,
            alphaMap: true,
            size: true,
            sizeAttenuation: true,
        };
    }
}

@NgModule({
    declarations: [NgtPointsMaterial],
    exports: [NgtPointsMaterial],
})
export class NgtPointsMaterialModule {}
