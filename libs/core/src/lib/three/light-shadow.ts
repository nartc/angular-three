import {
    Directive,
    Inject,
    Input,
    NgZone,
    Optional,
    SkipSelf,
} from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { NGT_INSTANCE_FACTORY } from '../di/instance';
import { NGT_CAMERA_INSTANCE_FACTORY } from '../di/object';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type { AnyConstructor, AnyFunction } from '../types';

export interface NgtCommonLightShadowState<
    TLightShadow extends THREE.LightShadow = THREE.LightShadow
> extends NgtInstanceState<TLightShadow> {
    lightShadow: TLightShadow;
}

@Directive()
export abstract class NgtCommonLightShadow<
    TLightShadow extends THREE.LightShadow = THREE.LightShadow
> extends NgtInstance<TLightShadow, NgtCommonLightShadowState<TLightShadow>> {
    abstract get lightShadowType(): AnyConstructor<TLightShadow>;

    @Input() set camera(camera: THREE.Camera) {
        this.set({ camera });
    }

    get lightShadow(): TLightShadow {
        return this.get((s) => s.lightShadow);
    }

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction,
        @Optional()
        @Inject(NGT_CAMERA_INSTANCE_FACTORY)
        defaultCameraInstanceFactory: AnyFunction<THREE.Camera>
    ) {
        super({ zone, store, parentInstanceFactory });
        if (defaultCameraInstanceFactory != null) {
            this.set({ camera: defaultCameraInstanceFactory() });
        }
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(
                this.store.ready$,
                () => {
                    const initSub = this.init(this.instanceArgs$);
                    return () => {
                        if (initSub && initSub.unsubscribe) {
                            initSub.unsubscribe();
                        }
                    };
                },
                true
            );
        });
        super.ngOnInit();
    }

    protected override get optionFields(): Record<string, boolean> {
        return { ...super.optionFields, camera: false };
    }

    private readonly init = this.effect<unknown[]>(
        tapEffect((instanceArgs) => {
            this.prepareInstance(
                new this.lightShadowType(...instanceArgs),
                'lightShadow'
            );
        })
    );
}
