// GENERATED
import {
    AnyFunction,
    makeVector4,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtStore,
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

@Component({
    selector: 'ngt-vector4[vector4]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceFactory<THREE.Vector4>(NgtVector4Attribute)],
})
export class NgtVector4Attribute extends NgtInstance<THREE.Vector4> {
    @Input() set vector4(vector4: NgtVector4) {
        this.zone.runOutsideAngular(() => {
            const instance = this.prepareInstance(makeVector4(vector4));
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
    declarations: [NgtVector4Attribute],
    exports: [NgtVector4Attribute],
})
export class NgtVector4AttributeModule {}
