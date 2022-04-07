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
    NgtFog,
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

export interface NgtFogState extends NgtInstanceState<THREE.Fog> {
    fog: NgtFog;
}

@Component({
    selector: 'ngt-fog[fog]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<THREE.Fog, NgtFogState>(NgtFogAttribute),
    ],
})
export class NgtFogAttribute extends NgtInstance<THREE.Fog, NgtFogState> {
    @Input() set fog(fog: NgtFog) {
        this.zone.runOutsideAngular(() => {
            if (this.instance) {
                applyProps(this.instance as unknown as NgtUnknownInstance, {
                    fog,
                });
            } else {
                this.set({
                    instance: prepare(
                        make(THREE.Fog, fog),
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
    declarations: [NgtFogAttribute],
    exports: [NgtFogAttribute],
})
export class NgtFogAttributeModule {}
