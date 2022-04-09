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
    selector: 'ngt-arrow-helper',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonHelperFactory<THREE.ArrowHelper>(NgtArrowHelper)],
})
export class NgtArrowHelper extends NgtCommonHelper<THREE.ArrowHelper> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.ArrowHelper>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.ArrowHelper>) {
        this.helperArgs = v;
    }

    @Input() set dir(dir: THREE.Vector3) {
        this.set({ dir });
    }

    @Input() set origin(origin: THREE.Vector3) {
        this.set({ origin });
    }

    @Input() set length(length: number) {
        this.set({ length });
    }

    @Input() set headLength(headLength: number) {
        this.set({ headLength });
    }

    @Input() set headWidth(headWidth: number) {
        this.set({ headWidth });
    }

    override get helperType(): AnyConstructor<THREE.ArrowHelper> {
        return THREE.ArrowHelper;
    }

    protected override get subInputs(): Record<string, boolean> {
        return {
            ...super.subInputs,
            dir: true,
            origin: true,
            length: true,
            headLength: true,
            headWidth: true,
        };
    }
}

@NgModule({
    declarations: [NgtArrowHelper],
    exports: [NgtArrowHelper],
})
export class NgtArrowHelperModule {}
