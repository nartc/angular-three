// GENERATED
import {
    AnyFunction,
    make,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtStore,
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

@Component({
    selector: 'ngt-fog-exp2[fogExp2]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceFactory<THREE.FogExp2>(NgtFogExp2Attribute)],
})
export class NgtFogExp2Attribute extends NgtInstance<THREE.FogExp2> {
    @Input() set fogExp2(fogExp2: NgtFogExp2) {
        this.zone.runOutsideAngular(() => {
            const instance = this.prepareInstance(make(THREE.FogExp2, fogExp2));
            this.set({ instance });
        });
    }

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction
    ) {
        super({ zone, store, parentInstanceFactory });
    }
}

@NgModule({
    declarations: [NgtFogExp2Attribute],
    exports: [NgtFogExp2Attribute],
})
export class NgtFogExp2AttributeModule {}
