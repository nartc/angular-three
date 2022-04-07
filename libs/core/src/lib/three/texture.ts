import { Directive, Inject, NgZone, Optional, SkipSelf } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { NGT_INSTANCE_FACTORY } from '../di/instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type { AnyConstructor, NgtUnknownInstance } from '../types';
import { AnyFunction } from '../types';
import { prepare } from '../utils/instance';

export interface NgtCommonTextureState<
    TTexture extends THREE.Texture = THREE.Texture
> extends NgtInstanceState<TTexture> {
    texture: TTexture;
    textureArgs: unknown[];
}

@Directive()
export abstract class NgtCommonTexture<
    TTexture extends THREE.Texture = THREE.Texture
> extends NgtInstance<TTexture, NgtCommonTextureState<TTexture>> {
    abstract get textureType(): AnyConstructor<TTexture>;

    protected set textureArgs(v: unknown | unknown[]) {
        this.set({ textureArgs: Array.isArray(v) ? v : [v] });
    }

    constructor(
        zone: NgZone,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction,
        protected store: NgtStore
    ) {
        super({ zone, shouldAttach: true, parentInstanceFactory });
        this.set({ textureArgs: [] });
    }

    get texture(): TTexture {
        return this.get((s) => s.texture);
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.select((s) => s.textureArgs));
            });
        });
        super.ngOnInit();
    }

    protected override destroy() {
        if (this.texture) {
            this.texture.dispose();
        }
        super.destroy();
    }

    private readonly init = this.effect<
        NgtCommonTextureState<TTexture>['textureArgs']
    >(
        tapEffect((textureArgs) => {
            const texture = prepare(
                new this.textureType(...textureArgs),
                () => this.store.get(),
                this.parentInstanceFactory?.() as NgtUnknownInstance
            );
            this.set({ texture, instance: texture });
            this.emitReady();

            return () => {
                texture.dispose();
            };
        })
    );
}
