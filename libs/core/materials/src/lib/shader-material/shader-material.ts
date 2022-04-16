// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    Input,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-shader-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonMaterialRef(NgtShaderMaterial)],
})
export class NgtShaderMaterial extends NgtCommonMaterial<
    THREE.ShaderMaterialParameters,
    THREE.ShaderMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.ShaderMaterialParameters
        | undefined;

    @Input() set uniforms(uniforms: { [uniform: string]: THREE.IUniform }) {
        this.set({ uniforms });
    }

    @Input() set vertexShader(vertexShader: string) {
        this.set({ vertexShader });
    }

    @Input() set fragmentShader(fragmentShader: string) {
        this.set({ fragmentShader });
    }

    @Input() set linewidth(linewidth: number) {
        this.set({ linewidth });
    }

    @Input() set wireframe(wireframe: boolean) {
        this.set({ wireframe });
    }

    @Input() set wireframeLinewidth(wireframeLinewidth: number) {
        this.set({ wireframeLinewidth });
    }

    @Input() set lights(lights: boolean) {
        this.set({ lights });
    }

    @Input() set clipping(clipping: boolean) {
        this.set({ clipping });
    }

    @Input() set extensions(extensions: {
        derivatives?: boolean;
        fragDepth?: boolean;
        drawBuffers?: boolean;
        shaderTextureLOD?: boolean;
    }) {
        this.set({ extensions });
    }

    @Input() set glslVersion(glslVersion: THREE.GLSLVersion) {
        this.set({ glslVersion });
    }

    get materialType(): AnyConstructor<THREE.ShaderMaterial> {
        return THREE.ShaderMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            uniforms: true,
            vertexShader: true,
            fragmentShader: true,
            linewidth: true,
            wireframe: true,
            wireframeLinewidth: true,
            lights: true,
            clipping: true,
            extensions: true,
            glslVersion: true,
        };
    }
}

@NgModule({
    declarations: [NgtShaderMaterial],
    exports: [NgtShaderMaterial],
})
export class NgtShaderMaterialModule {}
