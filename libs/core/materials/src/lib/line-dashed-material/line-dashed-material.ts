// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialRef,
    coerceNumberProperty,
    NumberInput,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    Input,
} from '@angular/core';
import * as THREE from 'three';
import { NgtLineBasicMaterial } from '../line-basic-material/line-basic-material';

@Component({
    selector: 'ngt-line-dashed-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonMaterialRef(NgtLineDashedMaterial)],
})
export class NgtLineDashedMaterial extends NgtLineBasicMaterial<
    THREE.LineDashedMaterialParameters,
    THREE.LineDashedMaterial
> {
    static override ngAcceptInputType_parameters:
        | THREE.LineDashedMaterialParameters
        | undefined;

    @Input() set scale(scale: NumberInput) {
        this.set({ scale: coerceNumberProperty(scale) });
    }

    @Input() set dashSize(dashSize: NumberInput) {
        this.set({ dashSize: coerceNumberProperty(dashSize) });
    }

    @Input() set gapSize(gapSize: NumberInput) {
        this.set({ gapSize: coerceNumberProperty(gapSize) });
    }

    override get materialType(): AnyConstructor<THREE.LineDashedMaterial> {
        return THREE.LineDashedMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            scale: true,
            dashSize: true,
            gapSize: true,
        };
    }
}

@NgModule({
    declarations: [NgtLineDashedMaterial],
    exports: [NgtLineDashedMaterial],
})
export class NgtLineDashedMaterialModule {}
