// GENERATED
import {
    AnyFunction,
    makeVector3,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtStore,
    provideInstanceRef,
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
import type { Subscription } from 'rxjs';

@Component({
    selector: 'ngt-vector3[vector3]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceRef(NgtVector3Attribute)],
})
export class NgtVector3Attribute extends NgtInstance<THREE.Vector3> {
    @Input() set vector3(vector3: NgtVector3) {
        this.zone.runOutsideAngular(() => {
            if (this.initSubscription) {
                this.initSubscription.unsubscribe();
            }

            this.initSubscription = this.onCanvasReady(
                this.store.ready$,
                () => {
                    this.prepareInstance(makeVector3(vector3));
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
    declarations: [NgtVector3Attribute],
    exports: [NgtVector3Attribute],
})
export class NgtVector3AttributeModule {}
