import {
  extend,
  injectNgtRef,
  injectNgtStore,
  NgtAnyRecord,
  NgtArgs,
  NgtBeforeRender,
  NgtRef,
  NgtRxStore,
} from '@angular-three/core';
import { shaderMaterial } from '@angular-three/soba/shaders';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { map, Observable, startWith, withLatestFrom } from 'rxjs';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  Points,
  Vector2,
  Vector3,
  Vector4,
} from 'three';

const SparklesMaterial = shaderMaterial(
  { time: 0, pixelRatio: 1 },
  /* glsl */
  `
uniform float pixelRatio;
uniform float time;

attribute float size;  
attribute float speed;  
attribute float opacity;
attribute vec3 noise;
attribute vec3 color;

varying vec3 vColor;
varying float vOpacity;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
  modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
  modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPostion = projectionMatrix * viewPosition;

  gl_Position = projectionPostion;
  gl_PointSize = size * 25. * pixelRatio;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vColor = color;
  vOpacity = opacity;
}
`,
  /* glsl */
  `
varying vec3 vColor;
varying float vOpacity;

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1;
  
  gl_FragColor = vec4(vColor, strength * vOpacity);
}
`
);

extend({ SparklesMaterial, Points, BufferGeometry, BufferAttribute });

const isFloat32Array = (def: any): def is Float32Array =>
  def && (def as Float32Array).constructor === Float32Array;

const expandColor = (v: THREE.Color) => [v.r, v.g, v.b];
const isVector = (v: any): v is THREE.Vector2 | THREE.Vector3 | THREE.Vector4 =>
  v instanceof Vector2 || v instanceof Vector3 || v instanceof Vector4;

const normalizeVector = (v: any): number[] => {
  if (Array.isArray(v)) return v;
  else if (isVector(v)) return v.toArray();
  return [v, v, v] as number[];
};

function usePropAsIsOrAsAttribute<T = any>(
  count: number,
  prop?: T | Float32Array,
  setDefault?: (v: T) => number
) {
  if (prop !== undefined) {
    if (isFloat32Array(prop)) {
      return prop as Float32Array;
    } else {
      if (prop instanceof Color) {
        const a = Array.from({ length: count * 3 }, () => expandColor(prop)).flat();
        return Float32Array.from(a);
      } else if (isVector(prop) || Array.isArray(prop)) {
        const a = Array.from({ length: count * 3 }, () => normalizeVector(prop)).flat();
        return Float32Array.from(a);
      }
      return Float32Array.from({ length: count }, () => prop as unknown as number);
    }
  }
  return Float32Array.from({ length: count }, setDefault!);
}

@Component({
  selector: 'ngts-sparkles',
  standalone: true,
  template: `
    <ngt-points ngtCompount *ref="pointsRef">
      <ngt-buffer-geometry>
        <ngt-buffer-attribute
          *args="[get('positions'), 3]"
          attach="attributes.position"
        ></ngt-buffer-attribute>
        <ngt-buffer-attribute
          *args="[get('sizes'), 1]"
          attach="attributes.size"
        ></ngt-buffer-attribute>
        <ngt-buffer-attribute
          *args="[get('opacities'), 1]"
          attach="attributes.opacity"
        ></ngt-buffer-attribute>
        <ngt-buffer-attribute
          *args="[get('speeds'), 1]"
          attach="attributes.speed"
        ></ngt-buffer-attribute>
        <ngt-buffer-attribute
          *args="[get('colors'), 3]"
          attach="attributes.color"
        ></ngt-buffer-attribute>
        <ngt-buffer-attribute
          *args="[get('noises'), 3]"
          attach="attributes.noise"
        ></ngt-buffer-attribute>
      </ngt-buffer-geometry>
      <ngt-sparkles-material
        *ref="materialRef"
        transparent
        [pixelRatio]="dpr"
        [depthWrite]="false"
        (beforeRender)="onMaterialBeforeRender($any($event))"
      ></ngt-sparkles-material>
    </ngt-points>
  `,
  imports: [NgtRef, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsSparkles extends NgtRxStore {
  readonly #store = injectNgtStore();
  readonly dpr = this.#store.get('viewport', 'dpr');
  readonly materialRef = injectNgtRef<typeof SparklesMaterial>();

  @Input() pointsRef = injectNgtRef<Points>();

  /** Number of particles (default: 100) */
  @Input() set count(count: number) {
    this.set({ count });
  }

  /** Speed of particles (default: 1) */
  @Input() set speed(speed: number | Float32Array) {
    this.set({ speed });
  }

  /** Opacity of particles (default: 1) */
  @Input() set opacity(opacity: number | Float32Array) {
    this.set({ opacity });
  }

  /** Color of particles (default: 100) */
  @Input() set color(color: THREE.ColorRepresentation | Float32Array) {
    this.set({ color });
  }

  /** Size of particles (default: randomized between 0 and 1) */
  @Input() set size(size: number | Float32Array) {
    this.set({ size });
  }

  /** The space the particles occupy (default: 1) */
  @Input() set scale(scale: number | [number, number, number] | THREE.Vector3) {
    this.set({ scale });
  }

  /** Movement factor (default: 1) */
  @Input() set noise(noise: number | [number, number, number] | THREE.Vector3 | Float32Array) {
    this.set({ noise });
  }

  override initialize() {
    super.initialize();
    this.set({
      noise: 1,
      count: 100,
      speed: 1,
      opacity: 1,
      scale: 1,
    });
    this.connect(
      'positions',
      this.select(['count', 'scale'], ({ count, scale }) =>
        Float32Array.from(
          Array.from({ length: count }, () =>
            normalizeVector(scale).map(MathUtils.randFloatSpread)
          ).flat()
        )
      )
    );

    this.connect('sizes', this.getAttribute$<number>('size', { setDefault: Math.random }));
    this.connect('opacities', this.getAttribute$<number>('opacity'));
    this.connect('speeds', this.getAttribute$<number>('speed'));
    this.connect(
      'noises',
      this.getAttribute$<number | [number, number, number] | THREE.Vector3 | Float32Array>(
        'noise',
        { countValue: (_, count) => count * 3 }
      )
    );
    this.connect(
      'colors',
      this.getAttribute$<THREE.ColorRepresentation>('color', {
        keyValue: (color) => (!isFloat32Array(color) ? new Color(color) : color),
        countValue: (color, count) => (color === undefined ? count * 3 : count),
        setDefault: () => 1,
      })
    );
  }

  onMaterialBeforeRender({ state, object }: NgtBeforeRender<typeof SparklesMaterial>) {
    (object as NgtAnyRecord)['uniforms'].time.value = state.clock.elapsedTime;
  }

  private getAttribute$<TValue>(
    key: string,
    options?: {
      keyValue?: (value: TValue, count: number) => TValue;
      countValue?: (value: TValue, count: number) => number;
      setDefault?: (value: TValue) => number;
    }
  ): Observable<Float32Array> {
    options ??= {};
    if (!options.keyValue) {
      options.keyValue = (value) => value;
    }

    if (!options.countValue) {
      options.countValue = (_, count) => count;
    }
    return this.select(key).pipe(
      startWith(this.get(key) || undefined),
      withLatestFrom(this.select('count')),
      map(([value, count]) =>
        usePropAsIsOrAsAttribute(
          options!.countValue!(value, count),
          options!.keyValue!(value, count),
          options?.setDefault
        )
      )
    );
  }
}
