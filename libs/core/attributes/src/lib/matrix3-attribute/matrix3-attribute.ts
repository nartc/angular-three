// GENERATED
import {
    AnyFunction,
    make,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtStore,
    provideInstanceFactory,
    NgtMatrix3,
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
    selector: 'ngt-matrix3[matrix3]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceFactory<THREE.Matrix3>(NgtMatrix3Attribute)],
})
export class NgtMatrix3Attribute extends NgtInstance<THREE.Matrix3> {
    @Input() set matrix3(matrix3: NgtMatrix3) {
        this.zone.runOutsideAngular(() => {
            const instance = this.prepareInstance(make(THREE.Matrix3, matrix3));
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
    declarations: [NgtMatrix3Attribute],
    exports: [NgtMatrix3Attribute],
})
export class NgtMatrix3AttributeModule {}
