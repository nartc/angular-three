// GENERATED
import {
    AnyFunction,
    applyProps,
    makeColor,
    NGT_INSTANCE_FACTORY,
    NgtInstance,
    NgtInstanceState,
    NgtStore,
    NgtUnknownInstance,
    prepare,
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

export interface NgtColorState extends NgtInstanceState<THREE.Color> {
    color: NgtColor;
}

@Component({
    selector: 'ngt-color[color]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<THREE.Color, NgtColorState>(NgtColorAttribute),
    ],
})
export class NgtColorAttribute extends NgtInstance<THREE.Color, NgtColorState> {
    @Input() set color(color: NgtColor) {
        this.zone.runOutsideAngular(() => {
            if (this.instance) {
                applyProps(this.instance as unknown as NgtUnknownInstance, {
                    color,
                });
            } else {
                this.set({
                    instance: prepare(
                        makeColor(color),
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
    declarations: [NgtColorAttribute],
    exports: [NgtColorAttribute],
})
export class NgtColorAttributeModule {}
