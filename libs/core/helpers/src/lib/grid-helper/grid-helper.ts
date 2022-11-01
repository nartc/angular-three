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
    selector: 'ngt-grid-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonHelper(NgtGridHelper),
        provideCommonHelperRef(NgtGridHelper)
    ],
})
export class NgtGridHelper extends NgtCommonHelper<THREE.GridHelper> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.GridHelper>
        | undefined;

    
    @Input() set size(size: NumberInput) {
        this.set({ size: coerceNumberProperty(size) });
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
    

    override get helperType(): AnyConstructor<THREE.GridHelper> {
        return THREE.GridHelper;
    }

    
    protected override get optionsFields(): Record<string, boolean> {
        return {
            ...super.optionsFields,
           size: true,
           divisions: true,
           color1: true,
           color2: true,
        };
    }
}
