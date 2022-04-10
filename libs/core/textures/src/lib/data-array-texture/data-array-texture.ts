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
    selector: 'ngt-data-array-texture',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonTextureFactory<THREE.DataArrayTexture>(
            NgtDataArrayTexture
        ),
    ],
})
export class NgtDataArrayTexture extends NgtCommonTexture<THREE.DataArrayTexture> {
    override get textureType(): AnyConstructor<THREE.DataArrayTexture> {
        return THREE.DataArrayTexture;
    }

    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.DataArrayTexture>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.DataArrayTexture>) {
        this.instanceArgs = v;
    }

    @Input() set data(data: BufferSource) {
        this.set({ data });
    }

    @Input() set width(width: number) {
        this.set({ width });
    }

    @Input() set height(height: number) {
        this.set({ height });
    }

    @Input() set depth(depth: number) {
        this.set({ depth });
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            data: true,
            width: true,
            height: true,
            depth: true,
        };
    }
}

@NgModule({
    declarations: [NgtDataArrayTexture],
    exports: [NgtDataArrayTexture],
})
export class NgtDataArrayTextureModule {}
