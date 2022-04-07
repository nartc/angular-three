// GENERATED
import {
    AnyFunction,
    applyProps,
    makeVector3,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtInstanceState,
    NgtStore,
    NgtUnknownInstance,
    prepare,
    provideInstanceFactory,
    NgtVector3,
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

export interface NgtVector3State extends NgtInstanceState<THREE.Vector3> {
    vector3: NgtVector3;
}

@Component({
    selector: 'ngt-vector3[vector3]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<THREE.Vector3, NgtVector3State>(
            NgtVector3Attribute
        ),
    ],
})
export class NgtVector3Attribute extends NgtInstance<
    THREE.Vector3,
    NgtVector3State
> {
    @Input() set vector3(vector3: NgtVector3) {
        this.zone.runOutsideAngular(() => {
            if (this.instance) {
                applyProps(this.instance as unknown as NgtUnknownInstance, {
                    vector3,
                });
            } else {
                this.set({
                    instance: prepare(
                        makeVector3(vector3),
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
    declarations: [NgtVector3Attribute],
    exports: [NgtVector3Attribute],
})
export class NgtVector3AttributeModule {}
