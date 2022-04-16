// GENERATED
import {
    AnyFunction,
    make,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtStore,
    provideInstanceRef,
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
import type { Subscription } from 'rxjs';

@Component({
    selector: 'ngt-matrix3[matrix3]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceRef(NgtMatrix3Attribute)],
})
export class NgtMatrix3Attribute extends NgtInstance<THREE.Matrix3> {
    @Input() set matrix3(matrix3: NgtMatrix3) {
        this.zone.runOutsideAngular(() => {
            if (this.initSubscription) {
                this.initSubscription.unsubscribe();
            }

            this.initSubscription = this.onCanvasReady(
                this.store.ready$,
                () => {
                    this.prepareInstance(make(THREE.Matrix3, matrix3));
                    return () => {
                        this.initSubscription?.unsubscribe();
                    };
                },
                true
            );
        });
    }

    private initSubscription?: Subscription;
}

@NgModule({
    declarations: [NgtMatrix3Attribute],
    exports: [NgtMatrix3Attribute],
})
export class NgtMatrix3AttributeModule {}
