// GENERATED
import {
    AnyFunction,
    makeColor,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtStore,
    provideInstanceFactory,
    NgtColor,
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
    selector: 'ngt-color[color]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceFactory<THREE.Color>(NgtColorAttribute)],
})
export class NgtColorAttribute extends NgtInstance<THREE.Color> {
    @Input() set color(color: NgtColor) {
        this.zone.runOutsideAngular(() => {
            const instance = this.prepareInstance(makeColor(color));
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
    declarations: [NgtColorAttribute],
    exports: [NgtColorAttribute],
})
export class NgtColorAttributeModule {}
