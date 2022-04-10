// GENERATED
import {
    AnyFunction,
    makeVector2,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtStore,
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

@Component({
    selector: 'ngt-vector2[vector2]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceFactory<THREE.Vector2>(NgtVector2Attribute)],
})
export class NgtVector2Attribute extends NgtInstance<THREE.Vector2> {
    @Input() set vector2(vector2: NgtVector2) {
        this.zone.runOutsideAngular(() => {
            const instance = this.prepareInstance(makeVector2(vector2));
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
    declarations: [NgtVector2Attribute],
    exports: [NgtVector2Attribute],
})
export class NgtVector2AttributeModule {}
