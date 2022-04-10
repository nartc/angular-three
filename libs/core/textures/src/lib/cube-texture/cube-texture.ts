// GENERATED
import {
    AnyConstructor,
    NgtCommonTexture,
    provideCommonTextureFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-cube-texture',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonTextureFactory<THREE.CubeTexture>(NgtCubeTexture)],
})
export class NgtCubeTexture extends NgtCommonTexture<THREE.CubeTexture> {
    override get textureType(): AnyConstructor<THREE.CubeTexture> {
        return THREE.CubeTexture;
    }

    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CubeTexture>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.CubeTexture>) {
        this.instanceArgs = v;
    }

    @Input() set images(images: any[]) {
        this.set({ images });
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

    @Input() override set encoding(encoding: THREE.TextureEncoding) {
        this.set({ encoding });
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            images: true,
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

@NgModule({
    declarations: [NgtCubeTexture],
    exports: [NgtCubeTexture],
})
export class NgtCubeTextureModule {}
