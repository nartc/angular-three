// GENERATED
import {
    AnyFunction,
    applyProps,
    makeVector2,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtInstanceState,
    NgtStore,
    NgtUnknownInstance,
    prepare,
    provideInstanceFactory,
    NgtVector2,
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

export interface NgtVector2State extends NgtInstanceState<THREE.Vector2> {
    vector2: NgtVector2;
}

@Component({
    selector: 'ngt-vector2[vector2]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<THREE.Vector2, NgtVector2State>(
            NgtVector2Attribute
        ),
    ],
})
export class NgtVector2Attribute extends NgtInstance<
    THREE.Vector2,
    NgtVector2State
> {
    @Input() set vector2(vector2: NgtVector2) {
        this.zone.runOutsideAngular(() => {
            if (this.instance) {
                applyProps(this.instance as unknown as NgtUnknownInstance, {
                    vector2,
                });
            } else {
                this.set({
                    instance: prepare(
                        makeVector2(vector2),
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
    declarations: [NgtVector2Attribute],
    exports: [NgtVector2Attribute],
})
export class NgtVector2AttributeModule {}
