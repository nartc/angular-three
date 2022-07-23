import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtObjectPassThrough,
  NgtObjectProps,
  NgtObjectPropsState,
  NgtRenderState,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  Ref,
} from '@angular-three/core';
import { NgtBufferAttribute } from '@angular-three/core/attributes';
import { NgtBufferGeometry } from '@angular-three/core/geometries';
import { NgtPoints } from '@angular-three/core/points';
import { StarFieldMaterial } from '@angular-three/soba/materials';
import { NgtSobaStarFieldMaterial } from '@angular-three/soba/shaders';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

const genStar = (r: number) => {
  return new THREE.Vector3().setFromSpherical(
    new THREE.Spherical(r, Math.acos(1 - Math.random() * 2), Math.random() * 2 * Math.PI)
  );
};

export interface NgtSobaStarsState extends NgtObjectPropsState<THREE.Points> {
  radius: number;
  depth: number;
  count: number;
  factor: number;
  saturation: number;
  fade: boolean;
  speed: number;
}

@Component({
  selector: 'ngt-soba-stars',
  standalone: true,
  template: `
    <ngt-points [ngtObjectPassThrough]="this" (beforeRender)="onBeforeRender($event.state)">
      <ngt-buffer-geometry>
        <ng-container *ngIf="bufferAttributes$ | async as bufferAttributes">
          <ngt-buffer-attribute
            [attach]="['attributes', 'position']"
            [args]="[bufferAttributes.positions, 3]"
          ></ngt-buffer-attribute>
          <ngt-buffer-attribute
            [attach]="['attributes', 'color']"
            [args]="[bufferAttributes.colors, 3]"
          ></ngt-buffer-attribute>
          <ngt-buffer-attribute
            [attach]="['attributes', 'size']"
            [args]="[bufferAttributes.sizes, 1]"
          ></ngt-buffer-attribute>
        </ng-container>
      </ngt-buffer-geometry>
      <ngt-soba-star-field-material
        [ref]="materialRef"
        [blending]="blending"
        [uniforms]="{ fade: { value: fade } }"
        transparent
        vertexColors
      ></ngt-soba-star-field-material>
    </ngt-points>
  `,
  imports: [
    NgtPoints,
    NgtObjectPassThrough,
    NgtBufferGeometry,
    NgtBufferAttribute,
    NgtSobaStarFieldMaterial,
    NgIf,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtObject(NgtSobaStars), provideObjectRef(NgtSobaStars), provideObjectHostRef(NgtSobaStars)],
})
export class NgtSobaStars extends NgtObjectProps<THREE.Points, NgtSobaStarsState> {
  @Input() set radius(radius: NumberInput) {
    this.set({ radius: coerceNumberProperty(radius) });
  }

  @Input() set depth(depth: NumberInput) {
    this.set({ depth: coerceNumberProperty(depth) });
  }

  @Input() set count(count: NumberInput) {
    this.set({ count: coerceNumberProperty(count) });
  }

  @Input() set factor(factor: NumberInput) {
    this.set({ factor: coerceNumberProperty(factor) });
  }

  @Input() set saturation(saturation: NumberInput) {
    this.set({ saturation: coerceNumberProperty(saturation) });
  }

  @Input() set fade(fade: BooleanInput) {
    this.set({ fade: coerceBooleanProperty(fade) });
  }
  get fade() {
    return this.get((s) => s.fade);
  }

  @Input() set speed(speed: NumberInput) {
    this.set({ speed: coerceNumberProperty(speed) });
  }

  readonly materialRef = new Ref<StarFieldMaterial>();
  readonly blending = THREE.AdditiveBlending;

  readonly bufferAttributes$ = this.select(
    this.select((s) => s.count),
    this.select((s) => s.depth),
    this.select((s) => s.factor),
    this.select((s) => s.radius),
    this.select((s) => s.saturation),
    (count, depth, factor, radius, saturation) => {
      const positions: number[] = [];
      const colors: number[] = [];
      const sizes = Array.from({ length: count }, () => (0.5 + 0.5 * Math.random()) * factor);
      const color = new THREE.Color();
      let r = radius + depth;
      const increment = depth / count;
      for (let i = 0; i < count; i++) {
        r -= increment * Math.random();
        positions.push(...genStar(r).toArray());
        color.setHSL(i / count, saturation, 0.9);
        colors.push(color.r, color.g, color.b);
      }

      return {
        positions: new Float32Array(positions),
        colors: new Float32Array(colors),
        sizes: new Float32Array(sizes),
      };
    }
  );

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      radius: state.radius ?? 100,
      depth: state.depth ?? 50,
      count: state.count ?? 5000,
      saturation: state.saturation ?? 0,
      factor: state.factor ?? 4,
      fade: state.fade ?? false,
      speed: state.speed ?? 1,
    }));
  }

  onBeforeRender(state: NgtRenderState) {
    if (this.materialRef.value) {
      this.materialRef.value.uniforms['time'].value = state.clock.getElapsedTime() * this.get((s) => s.speed);
    }
  }
}

@NgModule({
  imports: [NgtSobaStars],
  exports: [NgtSobaStars],
})
export class NgtSobaStarsModule {}
