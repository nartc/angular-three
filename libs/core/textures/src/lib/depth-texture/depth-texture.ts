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
    selector: 'ngt-depth-texture',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonTextureRef(NgtDepthTexture)],
})
export class NgtDepthTexture extends NgtCommonTexture<THREE.DepthTexture> {
    override get textureType(): AnyConstructor<THREE.DepthTexture> {
        return THREE.DepthTexture;
    }

    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.DepthTexture>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.DepthTexture>) {
        this.instanceArgs = v;
    }

    @Input() set width(width: number) {
        this.set({ width });
    }

    @Input() set height(height: number) {
        this.set({ height });
    }

    @Input() override set type(type: THREE.TextureDataType) {
        this.set({ type });
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

    @Input() override set anisotropy(anisotropy: number) {
        this.set({ anisotropy });
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            width: false,
            height: false,
            type: true,
            mapping: true,
            wrapS: true,
            wrapT: true,
            magFilter: true,
            minFilter: true,
            anisotropy: true,
        };
    }
}

@NgModule({
    declarations: [NgtDepthTexture],
    exports: [NgtDepthTexture],
})
export class NgtDepthTextureModule {}
