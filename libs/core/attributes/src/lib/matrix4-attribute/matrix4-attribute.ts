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
    NgtMatrix4,
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

export interface NgtMatrix4State extends NgtInstanceState<THREE.Matrix4> {
    matrix4: NgtMatrix4;
}

@Component({
    selector: 'ngt-matrix4[matrix4]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<THREE.Matrix4, NgtMatrix4State>(
            NgtMatrix4Attribute
        ),
    ],
})
export class NgtMatrix4Attribute extends NgtInstance<
    THREE.Matrix4,
    NgtMatrix4State
> {
    @Input() set matrix4(matrix4: NgtMatrix4) {
        this.zone.runOutsideAngular(() => {
            if (this.instance) {
                applyProps(this.instance as unknown as NgtUnknownInstance, {
                    matrix4,
                });
            } else {
                this.set({
                    instance: prepare(
                        make(THREE.Matrix4, matrix4),
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
    declarations: [NgtMatrix4Attribute],
    exports: [NgtMatrix4Attribute],
})
export class NgtMatrix4AttributeModule {}
