import { AnyConstructor, provideCommonMaterialRef } from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { Component, NgModule } from '@angular/core';
import * as THREE from 'three';

export class StarFieldMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: { time: { value: 0.0 }, fade: { value: 1.0 } },
      vertexShader: /* glsl */ `
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(mvPosition.x + 2.0 * time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,
      fragmentShader: /* glsl */ `
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);
      }`,
    });
  }
}

@Component({
  selector: 'ngt-soba-star-field-material',
  template: `<ng-content></ng-content>`,
  providers: [provideCommonMaterialRef(NgtSobaStarFieldMaterial)],
})
export class NgtSobaStarFieldMaterial extends NgtShaderMaterial {
  override get materialType(): AnyConstructor<StarFieldMaterial> {
    return StarFieldMaterial;
  }
}

@NgModule({
  declarations: [NgtSobaStarFieldMaterial],
  exports: [NgtSobaStarFieldMaterial],
})
export class NgtSobaStarFieldMaterialModule {}
