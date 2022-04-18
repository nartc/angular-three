// GENERATED
import {
    AnyConstructor,
    NgtCommonTexture,
    provideCommonTextureRef,
    coerceNumberProperty,
    NumberInput,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-data3-dtexture',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonTextureRef(NgtData3DTexture)],
})
export class NgtData3DTexture extends NgtCommonTexture<THREE.Data3DTexture> {
    override get textureType(): AnyConstructor<THREE.Data3DTexture> {
        return THREE.Data3DTexture;
    }

    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Data3DTexture>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.Data3DTexture>) {
        this.instanceArgs = v;
    }

    @Input() set data(data: BufferSource) {
        this.set({ data });
    }

    @Input() set width(width: NumberInput) {
        this.set({ width: coerceNumberProperty(width) });
    }

    @Input() set height(height: NumberInput) {
        this.set({ height: coerceNumberProperty(height) });
    }

    @Input() set depth(depth: NumberInput) {
        this.set({ depth: coerceNumberProperty(depth) });
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            data: false,
            width: false,
            height: false,
            depth: false,
        };
    }
}

@NgModule({
    declarations: [NgtData3DTexture],
    exports: [NgtData3DTexture],
})
export class NgtData3DTextureModule {}
