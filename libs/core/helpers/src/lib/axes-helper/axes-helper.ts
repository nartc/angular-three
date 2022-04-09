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
    selector: 'ngt-axes-helper',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonHelperFactory<THREE.AxesHelper>(NgtAxesHelper)],
})
export class NgtAxesHelper extends NgtCommonHelper<THREE.AxesHelper> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.AxesHelper>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.AxesHelper>) {
        this.helperArgs = v;
    }

    @Input() set size(size: number) {
        this.set({ size });
    }

    override get helperType(): AnyConstructor<THREE.AxesHelper> {
        return THREE.AxesHelper;
    }

    protected override get subInputs(): Record<string, boolean> {
        return {
            ...super.subInputs,
            size: true,
        };
    }
}

@NgModule({
    declarations: [NgtAxesHelper],
    exports: [NgtAxesHelper],
})
export class NgtAxesHelperModule {}
