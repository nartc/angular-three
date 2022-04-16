import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { tapEffect } from '../stores/component-store';
import type { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonTexture<
    TTexture extends THREE.Texture = THREE.Texture
> extends NgtInstance<TTexture, NgtInstanceState<TTexture>> {
    abstract get textureType(): AnyConstructor<TTexture>;

    @Input() set image(
        image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
    ) {
        this.set({ image });
    }

    @Input() set mapping(mapping: THREE.Mapping) {
        this.set({ mapping });
    }

    @Input() set wrapS(wrapS: THREE.Wrapping) {
        this.set({ wrapS });
    }

    @Input() set wrapT(wrapT: THREE.Wrapping) {
        this.set({ wrapT });
    }

    @Input() set magFilter(magFilter: THREE.TextureFilter) {
        this.set({ magFilter });
    }

    @Input() set minFilter(minFilter: THREE.TextureFilter) {
        this.set({ minFilter });
    }

    @Input() set format(
        format: THREE.PixelFormat | THREE.CompressedPixelFormat
    ) {
        this.set({ format });
    }

    @Input() set type(type: THREE.TextureDataType) {
        this.set({ type });
    }

    @Input() set anisotropy(anisotropy: number) {
        this.set({ anisotropy });
    }

    @Input() set encoding(encoding: THREE.TextureEncoding) {
        this.set({ encoding });
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
                new this.textureType(...instanceArgs)
            );

            return () => {
                texture.dispose();
            };
        })
    );

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            image: true,
            mapping: true,
            wrapS: true,
            wrapT: true,
            magFilter: true,
            minFilter: true,
            format: true,
            type: true,
            anisotropy: true,
            encoding: true,
        };
    }
}
