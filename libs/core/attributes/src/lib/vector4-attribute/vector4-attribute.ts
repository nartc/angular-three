// GENERATED
import {
    AnyFunction,
    applyProps,
    makeVector4,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtInstanceState,
    NgtStore,
    NgtUnknownInstance,
    prepare,
    provideInstanceFactory,
    NgtVector4,
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

export interface NgtVector4State extends NgtInstanceState<THREE.Vector4> {
    vector4: NgtVector4;
}

@Component({
    selector: 'ngt-vector4[vector4]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<THREE.Vector4, NgtVector4State>(
            NgtVector4Attribute
        ),
    ],
})
export class NgtVector4Attribute extends NgtInstance<
    THREE.Vector4,
    NgtVector4State
> {
    @Input() set vector4(vector4: NgtVector4) {
        this.zone.runOutsideAngular(() => {
            if (this.instance) {
                applyProps(this.instance as unknown as NgtUnknownInstance, {
                    vector4,
                });
            } else {
                this.set({
                    instance: prepare(
                        makeVector4(vector4),
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
    declarations: [NgtVector4Attribute],
    exports: [NgtVector4Attribute],
})
export class NgtVector4AttributeModule {}
