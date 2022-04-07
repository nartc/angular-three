// GENERATED
import {
    AnyFunction,
    applyProps,
    make,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtInstanceState,
    NgtStore,
    NgtUnknownInstance,
    prepare,
    provideInstanceFactory,
    NgtMatrix3,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule,
    NgZone,
    Optional,
    SkipSelf,
} from '@angular/core';
import * as THREE from 'three';

export interface NgtMatrix3State extends NgtInstanceState<THREE.Matrix3> {
    matrix3: NgtMatrix3;
}

@Component({
    selector: 'ngt-matrix3[matrix3]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<THREE.Matrix3, NgtMatrix3State>(
            NgtMatrix3Attribute
        ),
    ],
})
export class NgtMatrix3Attribute extends NgtInstance<
    THREE.Matrix3,
    NgtMatrix3State
> {
    @Input() set matrix3(matrix3: NgtMatrix3) {
        this.zone.runOutsideAngular(() => {
            if (this.instance) {
                applyProps(this.instance as unknown as NgtUnknownInstance, {
                    matrix3,
                });
            } else {
                this.set({
                    instance: prepare(
                        make(THREE.Matrix3, matrix3),
                        () => this.store.get(),
                        this.parentInstanceFactory?.() as NgtUnknownInstance
                    ),
                });
            }
        });
    }

    constructor(
        zone: NgZone,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction,
        private store: NgtStore
    ) {
        super({ zone, shouldAttach: true, parentInstanceFactory });
    }
}

@NgModule({
    declarations: [NgtMatrix3Attribute],
    exports: [NgtMatrix3Attribute],
})
export class NgtMatrix3AttributeModule {}
