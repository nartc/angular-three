import { Directive, Inject, NgZone, Optional, SkipSelf } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { NGT_INSTANCE_FACTORY } from '../di/instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type { AnyConstructor } from '../types';
import { AnyFunction } from '../types';

export interface NgtCommonTextureState<
    TTexture extends THREE.Texture = THREE.Texture
> extends NgtInstanceState<TTexture> {
    texture: TTexture;
}

@Directive()
export abstract class NgtCommonTexture<
    TTexture extends THREE.Texture = THREE.Texture
> extends NgtInstance<TTexture, NgtCommonTextureState<TTexture>> {
    abstract get textureType(): AnyConstructor<TTexture>;

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

    get texture(): TTexture {
        return this.get((s) => s.texture);
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.instanceArgs$);
            });
        });
        super.ngOnInit();
    }

    private readonly init = this.effect<unknown[]>(
        tapEffect((instanceArgs) => {
            const texture = this.prepareInstance(
                new this.textureType(...instanceArgs),
                'texture'
            );

            return () => {
                texture.dispose();
            };
        })
    );
}
