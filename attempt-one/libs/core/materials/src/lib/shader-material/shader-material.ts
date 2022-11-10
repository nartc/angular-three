// GENERATED - AngularThree v7.0.0
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  coerceBooleanProperty,
  BooleanInput,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-shader-material',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonMaterial(NgtShaderMaterial),
    provideCommonMaterialRef(NgtShaderMaterial),
  ],
})
export class NgtShaderMaterial extends NgtCommonMaterial<THREE.ShaderMaterial> {
  @Input() set uniforms(uniforms: { [uniform: string]: THREE.IUniform }) {
    this.set({ uniforms });
  }

  @Input() set vertexShader(vertexShader: string) {
    this.set({ vertexShader });
  }

  @Input() set fragmentShader(fragmentShader: string) {
    this.set({ fragmentShader });
  }

  @Input() set linewidth(linewidth: NumberInput) {
    this.set({ linewidth: coerceNumberProperty(linewidth) });
  }

  @Input() set wireframe(wireframe: BooleanInput) {
    this.set({ wireframe: coerceBooleanProperty(wireframe) });
  }

  @Input() set wireframeLinewidth(wireframeLinewidth: NumberInput) {
    this.set({ wireframeLinewidth: coerceNumberProperty(wireframeLinewidth) });
  }

  @Input() set lights(lights: BooleanInput) {
    this.set({ lights: coerceBooleanProperty(lights) });
  }

  @Input() set clipping(clipping: BooleanInput) {
    this.set({ clipping: coerceBooleanProperty(clipping) });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
  }

  @Input() set extensions(extensions: BooleanInput) {
    this.set({ extensions: coerceBooleanProperty(extensions) });
  }

  @Input() set glslVersion(glslVersion: THREE.GLSLVersion) {
    this.set({ glslVersion });
  }

  override get materialType(): AnyConstructor<THREE.ShaderMaterial> {
    return THREE.ShaderMaterial;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      uniforms: true,
      vertexShader: true,
      fragmentShader: true,
      linewidth: true,
      wireframe: true,
      wireframeLinewidth: true,
      lights: true,
      clipping: true,
      fog: true,
      extensions: true,
      glslVersion: true,
    };
  }
}
