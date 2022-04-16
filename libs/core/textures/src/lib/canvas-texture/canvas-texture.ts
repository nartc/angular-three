// GENERATED
import {
    AnyConstructor,
    NgtCommonTexture,
    provideCommonTextureRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-canvas-texture',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonTextureRef(NgtCanvasTexture)],
})
export class NgtCanvasTexture extends NgtCommonTexture<THREE.CanvasTexture> {
    override get textureType(): AnyConstructor<THREE.CanvasTexture> {
        return THREE.CanvasTexture;
    }

    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CanvasTexture>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.CanvasTexture>) {
        this.instanceArgs = v;
    }

    @Input() set canvas(
        canvas:
            | HTMLImageElement
            | HTMLCanvasElement
            | HTMLVideoElement
            | ImageBitmap
    ) {
        this.set({ canvas });
    }

    @Input() override set mapping(mapping: THREE.Mapping) {
        this.set({ mapping });
    }

    @Input() override set wrapS(wrapS: THREE.Wrapping) {
        this.set({ wrapS });
    }

    @Input() override set wrapT(wrapT: THREE.Wrapping) {
        this.set({ wrapT });
    }

    @Input() override set magFilter(magFilter: THREE.TextureFilter) {
        this.set({ magFilter });
    }

    @Input() override set minFilter(minFilter: THREE.TextureFilter) {
        this.set({ minFilter });
    }

    @Input() override set format(format: THREE.PixelFormat) {
        this.set({ format });
    }

    @Input() override set type(type: THREE.TextureDataType) {
        this.set({ type });
    }

    @Input() override set anisotropy(anisotropy: number) {
        this.set({ anisotropy });
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            canvas: false,
            mapping: true,
            wrapS: true,
            wrapT: true,
            magFilter: true,
            minFilter: true,
            format: true,
            type: true,
            anisotropy: true,
        };
    }
}

@NgModule({
    declarations: [NgtCanvasTexture],
    exports: [NgtCanvasTexture],
})
export class NgtCanvasTextureModule {}
