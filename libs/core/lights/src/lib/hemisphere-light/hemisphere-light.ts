// GENERATED
import {
    AnyConstructor,
    NgtCommonLight,
    provideNgtCommonLight,
    provideCommonLightRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-hemisphere-light',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonLight(NgtHemisphereLight),
        provideCommonLightRef(NgtHemisphereLight)
    ],
})
export class NgtHemisphereLight extends NgtCommonLight<THREE.HemisphereLight> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.HemisphereLight>
        | undefined;

    
    @Input() set skyColor(skyColor: THREE.ColorRepresentation) {
        this.set({ skyColor });
    }
    
    @Input() set groundColor(groundColor: THREE.ColorRepresentation) {
        this.set({ groundColor });
    }
    

    override get lightType(): AnyConstructor<THREE.HemisphereLight> {
        return THREE.HemisphereLight;
    }
    
    protected override get optionsFields(): Record<string, boolean> {
        return {
            ...super.optionsFields,
           skyColor: true,
           groundColor: true,
        };
    }
}
