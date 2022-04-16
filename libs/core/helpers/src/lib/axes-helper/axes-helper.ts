// GENERATED
import {
    AnyConstructor,
    NgtCommonHelper,
    provideCommonHelperRef,
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
    providers: [provideCommonHelperRef(NgtAxesHelper)],
})
export class NgtAxesHelper extends NgtCommonHelper<THREE.AxesHelper> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.AxesHelper>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.AxesHelper>) {
        this.instanceArgs = v;
    }

    @Input() set size(size: number) {
        this.set({ size });
    }

    override get helperType(): AnyConstructor<THREE.AxesHelper> {
        return THREE.AxesHelper;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            size: true,
        };
    }
}

@NgModule({
    declarations: [NgtAxesHelper],
    exports: [NgtAxesHelper],
})
export class NgtAxesHelperModule {}
