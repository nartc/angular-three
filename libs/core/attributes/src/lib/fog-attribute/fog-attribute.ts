// GENERATED
import {
    AnyFunction,
    make,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtStore,
    provideInstanceRef,
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
import type { Subscription } from 'rxjs';

@Component({
    selector: 'ngt-fog[fog]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceRef(NgtFogAttribute)],
})
export class NgtFogAttribute extends NgtInstance<THREE.Fog> {
    @Input() set fog(fog: NgtFog) {
        this.zone.runOutsideAngular(() => {
            if (this.initSubscription) {
                this.initSubscription.unsubscribe();
            }

            this.initSubscription = this.onCanvasReady(
                this.store.ready$,
                () => {
                    this.prepareInstance(make(THREE.Fog, fog));
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
    declarations: [NgtFogAttribute],
    exports: [NgtFogAttribute],
})
export class NgtFogAttributeModule {}
