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
    NgtFogExp2,
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

export interface NgtFogExp2State extends NgtInstanceState<THREE.FogExp2> {
    fogExp2: NgtFogExp2;
}

@Component({
    selector: 'ngt-fog-exp2[fogExp2]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<THREE.FogExp2, NgtFogExp2State>(
            NgtFogExp2Attribute
        ),
    ],
})
export class NgtFogExp2Attribute extends NgtInstance<
    THREE.FogExp2,
    NgtFogExp2State
> {
    @Input() set fogExp2(fogExp2: NgtFogExp2) {
        this.zone.runOutsideAngular(() => {
            if (this.instance) {
                applyProps(this.instance as unknown as NgtUnknownInstance, {
                    fogExp2,
                });
            } else {
                this.set({
                    instance: prepare(
                        make(THREE.FogExp2, fogExp2),
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
    declarations: [NgtFogExp2Attribute],
    exports: [NgtFogExp2Attribute],
})
export class NgtFogExp2AttributeModule {}
