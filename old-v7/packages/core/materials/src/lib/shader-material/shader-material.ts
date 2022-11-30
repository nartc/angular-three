// GENERATED - AngularThree v7.0.0
import {
  coerceBoolean,
  coerceNumber,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtCommonMaterial,
  NgtNumberInput,
  NgtObservableInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-shader-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtShaderMaterial), provideCommonMaterialRef(NgtShaderMaterial)],
})
export class NgtShaderMaterial extends NgtCommonMaterial<THREE.ShaderMaterial> {
  @Input() set uniforms(uniforms: NgtObservableInput<{ [uniform: string]: THREE.IUniform }>) {
    this.set({ uniforms });
  }

  @Input() set vertexShader(vertexShader: NgtObservableInput<string>) {
    this.set({ vertexShader });
  }

  @Input() set fragmentShader(fragmentShader: NgtObservableInput<string>) {
    this.set({ fragmentShader });
  }

  @Input() set linewidth(linewidth: NgtObservableInput<NgtNumberInput>) {
    this.set({ linewidth: isObservable(linewidth) ? linewidth.pipe(map(coerceNumber)) : coerceNumber(linewidth) });
  }

  @Input() set wireframe(wireframe: NgtObservableInput<NgtBooleanInput>) {
    this.set({ wireframe: isObservable(wireframe) ? wireframe.pipe(map(coerceBoolean)) : coerceBoolean(wireframe) });
  }

  @Input() set wireframeLinewidth(wireframeLinewidth: NgtObservableInput<NgtNumberInput>) {
    this.set({
      wireframeLinewidth: isObservable(wireframeLinewidth)
        ? wireframeLinewidth.pipe(map(coerceNumber))
        : coerceNumber(wireframeLinewidth),
    });
  }

  @Input() set lights(lights: NgtObservableInput<NgtBooleanInput>) {
    this.set({ lights: isObservable(lights) ? lights.pipe(map(coerceBoolean)) : coerceBoolean(lights) });
  }

  @Input() set clipping(clipping: NgtObservableInput<NgtBooleanInput>) {
    this.set({ clipping: isObservable(clipping) ? clipping.pipe(map(coerceBoolean)) : coerceBoolean(clipping) });
  }

  @Input() set fog(fog: NgtObservableInput<NgtBooleanInput>) {
    this.set({ fog: isObservable(fog) ? fog.pipe(map(coerceBoolean)) : coerceBoolean(fog) });
  }

  @Input() set extensions(extensions: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      extensions: isObservable(extensions) ? extensions.pipe(map(coerceBoolean)) : coerceBoolean(extensions),
    });
  }

  @Input() set glslVersion(glslVersion: NgtObservableInput<THREE.GLSLVersion>) {
    this.set({ glslVersion });
  }

  override get materialType(): NgtAnyConstructor<THREE.ShaderMaterial> {
    return THREE.ShaderMaterial;
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'uniforms',
      'vertexShader',
      'fragmentShader',
      'linewidth',
      'wireframe',
      'wireframeLinewidth',
      'lights',
      'clipping',
      'fog',
      'extensions',
      'glslVersion',
    ];
  }
}
