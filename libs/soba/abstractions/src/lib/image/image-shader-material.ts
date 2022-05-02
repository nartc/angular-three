import {
  AnyConstructor,
  coerceNumberProperty,
  NgtColor,
  NumberInput,
  provideCommonMaterialRef,
  shaderMaterial,
} from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

export type NgtSobaImageShaderMaterialParameters = THREE.ShaderMaterialParameters & {
  map: THREE.Texture;
  scale?: number[];
  imageBounds?: number[];
  color?: NgtColor;
  zoom?: number;
  grayscale?: number;
};

export const ImageShaderMaterial = shaderMaterial(
  {
    color: new THREE.Color('white'),
    scale: [1, 1],
    imageBounds: [1, 1],
    map: null,
    zoom: 1,
    grayscale: 0,
  },
  // language=glsl
  `
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
    vUv = uv;
  }
`,
  // language=glsl
  `
  // mostly from https://gist.github.com/statico/df64c5d167362ecf7b34fca0b1459a44
  varying vec2 vUv;
  uniform vec2 scale;
  uniform vec2 imageBounds;
  uniform vec3 color;
  uniform sampler2D map;
  uniform float zoom;
  uniform float grayscale;
  const vec3 luma = vec3(.299, 0.587, 0.114);
  vec4 toGrayscale(vec4 color, float intensity) {
    return vec4(mix(color.rgb, vec3(dot(color.rgb, luma)), intensity), color.a);
  }
  vec2 aspect(vec2 size) {
    return size / min(size.x, size.y);
  }
  void main() {
    vec2 s = aspect(scale);
    vec2 i = aspect(imageBounds);
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
    vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
    vec2 uv = vUv * s / new + offset;
    vec2 zUv = (uv - vec2(0.5, 0.5)) / zoom + vec2(0.5, 0.5);
    gl_FragColor = toGrayscale(texture2D(map, zUv) * vec4(color, 1.0), grayscale);
  }
`
);

@Component({
  selector: 'ngt-soba-image-shader-material',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonMaterialRef(NgtSobaImageShaderMaterial)],
})
export class NgtSobaImageShaderMaterial extends NgtShaderMaterial {
  static override ngAcceptInputType_parameters: NgtSobaImageShaderMaterialParameters | undefined;

  @Input() set map(map: THREE.Texture) {
    this.set({ map });
  }

  @Input() set scale(scale: number[]) {
    this.set({ scale });
  }

  @Input() set imageBounds(imageBounds: number[]) {
    this.set({ imageBounds });
  }

  @Input() set color(color: NgtColor) {
    this.set({ color });
  }

  @Input() set zoom(zoom: NumberInput) {
    this.set({ zoom: coerceNumberProperty(zoom) });
  }

  @Input() set grayscale(grayscale: NumberInput) {
    this.set({ grayscale: coerceNumberProperty(grayscale) });
  }

  override get materialType(): AnyConstructor<typeof ImageShaderMaterial.prototype> {
    return ImageShaderMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      map: false,
      scale: true,
      imageBounds: true,
      color: true,
      zoom: true,
      grayscale: true,
    };
  }
}

@NgModule({
  declarations: [NgtSobaImageShaderMaterial],
  exports: [NgtSobaImageShaderMaterial],
})
export class NgtSobaImageShaderMaterialModule {}
