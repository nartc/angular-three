// GENERATED - AngularThree v7.0.0
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideNgtCommonMaterial,
    provideCommonMaterialRef,coerceBooleanProperty, BooleanInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-shadow-material',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonMaterial(NgtShadowMaterial),
        provideCommonMaterialRef(NgtShadowMaterial)
    ]
})
export class NgtShadowMaterial extends NgtCommonMaterial<THREE.ShadowMaterial> {
    
    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
    }
    
    @Input() set fog(fog: BooleanInput) {
        this.set({ fog: coerceBooleanProperty(fog) });
    }
    

    override get materialType(): AnyConstructor<THREE.ShadowMaterial> {
        return THREE.ShadowMaterial;
    }
    
    protected override get optionsFields(): Record<string, boolean> {
        return {
            ...super.optionsFields,
            color: true,
            fog: true,
        };
    }
}
