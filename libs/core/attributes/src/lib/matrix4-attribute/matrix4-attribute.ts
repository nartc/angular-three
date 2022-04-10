// GENERATED
import {
    AnyFunction,
    make,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtStore,
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

@Component({
    selector: 'ngt-matrix4[matrix4]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceFactory<THREE.Matrix4>(NgtMatrix4Attribute)],
})
export class NgtMatrix4Attribute extends NgtInstance<THREE.Matrix4> {
    @Input() set matrix4(matrix4: NgtMatrix4) {
        this.zone.runOutsideAngular(() => {
            const instance = this.prepareInstance(make(THREE.Matrix4, matrix4));
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
    declarations: [NgtMatrix4Attribute],
    exports: [NgtMatrix4Attribute],
})
export class NgtMatrix4AttributeModule {}
