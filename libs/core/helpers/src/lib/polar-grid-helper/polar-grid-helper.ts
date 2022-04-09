// GENERATED
import {
    AnyConstructor,
    NgtCommonHelper,
    provideCommonHelperFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-polar-grid-helper',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonHelperFactory<THREE.PolarGridHelper>(NgtPolarGridHelper),
    ],
})
export class NgtPolarGridHelper extends NgtCommonHelper<THREE.PolarGridHelper> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.PolarGridHelper>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.PolarGridHelper>) {
        this.helperArgs = v;
    }

    @Input() set radius(radius: number) {
        this.set({ radius });
    }

    @Input() set radials(radials: number) {
        this.set({ radials });
    }

    @Input() set circles(circles: number) {
        this.set({ circles });
    }

    @Input() set divisions(divisions: number) {
        this.set({ divisions });
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

    protected override get subInputs(): Record<string, boolean> {
        return {
            ...super.subInputs,
            radius: true,
            radials: true,
            circles: true,
            divisions: true,
            color1: true,
            color2: true,
        };
    }
}

@NgModule({
    declarations: [NgtPolarGridHelper],
    exports: [NgtPolarGridHelper],
})
export class NgtPolarGridHelperModule {}
