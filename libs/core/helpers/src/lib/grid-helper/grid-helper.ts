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
    selector: 'ngt-grid-helper',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonHelperFactory<THREE.GridHelper>(NgtGridHelper)],
})
export class NgtGridHelper extends NgtCommonHelper<THREE.GridHelper> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.GridHelper>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.GridHelper>) {
        this.helperArgs = v;
    }

    @Input() set size(size: number) {
        this.set({ size });
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

    override get helperType(): AnyConstructor<THREE.GridHelper> {
        return THREE.GridHelper;
    }

    protected override get subInputs(): Record<string, boolean> {
        return {
            ...super.subInputs,
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