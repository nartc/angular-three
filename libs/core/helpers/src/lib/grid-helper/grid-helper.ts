// GENERATED
import {
    AnyConstructor,
    NgtCommonHelper,
    provideCommonHelperRef,
    coerceNumberProperty,
    NumberInput,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-grid-helper',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonHelperRef(NgtGridHelper)],
})
export class NgtGridHelper extends NgtCommonHelper<THREE.GridHelper> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.GridHelper>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.GridHelper>) {
        this.instanceArgs = v;
    }

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

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            size: true,
            divisions: true,
            color1: true,
            color2: true,
        };
    }
}

@NgModule({
    declarations: [NgtGridHelper],
    exports: [NgtGridHelper],
})
export class NgtGridHelperModule {}
