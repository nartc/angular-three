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
export class NgtLineBasicMaterial<
    TLineBasicMaterialParameters extends THREE.LineBasicMaterialParameters = THREE.LineBasicMaterialParameters,
    TLineBasicMaterial extends THREE.LineBasicMaterial = THREE.LineBasicMaterial
> extends NgtCommonMaterial<
    THREE.LineBasicMaterialParameters,
    THREE.LineBasicMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.LineBasicMaterialParameters
        | undefined;

    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
    }

    @Input() set linewidth(linewidth: number) {
        this.set({ linewidth });
    }

    @Input() set linecap(linecap: string) {
        this.set({ linecap });
    }

    @Input() set linejoin(linejoin: string) {
        this.set({ linejoin });
    }

    get materialType(): AnyConstructor<THREE.LineBasicMaterial> {
        return THREE.LineBasicMaterial;
    }

    protected override get subParameters(): Record<string, boolean> {
        return {
            ...super.subParameters,
            color: true,
            linewidth: true,
            linecap: true,
            linejoin: true,
        };
    }
}

@NgModule({
    declarations: [NgtLineBasicMaterial],
    exports: [NgtLineBasicMaterial],
})
export class NgtLineBasicMaterialModule {}