// GENERATED
import {
    AnyConstructor,
    NgtCommonHelper,
    provideNgtCommonHelper,
    provideCommonHelperRef, coerceNumberProperty, NumberInput,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-polar-grid-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonHelper(NgtPolarGridHelper),
        provideCommonHelperRef(NgtPolarGridHelper)
    ],
})
export class NgtPolarGridHelper extends NgtCommonHelper<THREE.PolarGridHelper> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.PolarGridHelper>
        | undefined;

    
    @Input() set radius(radius: NumberInput) {
        this.set({ radius: coerceNumberProperty(radius) });
    }
    
    @Input() set radials(radials: NumberInput) {
        this.set({ radials: coerceNumberProperty(radials) });
    }
    
    @Input() set circles(circles: NumberInput) {
        this.set({ circles: coerceNumberProperty(circles) });
    }
    
    @Input() set divisions(divisions: NumberInput) {
        this.set({ divisions: coerceNumberProperty(divisions) });
    }
    
    @Input() set color1(color1: THREE.ColorRepresentation) {
        this.set({ color1 });
    }
    
    @Input() set color2(color2: THREE.ColorRepresentation) {
        this.set({ color2 });
    }
    

    override get helperType(): AnyConstructor<THREE.PolarGridHelper> {
        return THREE.PolarGridHelper;
    }

    
    protected override get optionsFields(): Record<string, boolean> {
        return {
            ...super.optionsFields,
           radius: true,
           radials: true,
           circles: true,
           divisions: true,
           color1: true,
           color2: true,
        };
    }
}
