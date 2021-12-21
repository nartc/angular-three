import {
  EnhancedRxState,
  NgtRender,
  NgtSobaExtender,
} from '@angular-three/core';
import { NgtBufferAttributeModule } from '@angular-three/core/attributes';
import { NgtBufferGeometryModule } from '@angular-three/core/geometries';
import { NgtPointsModule } from '@angular-three/core/points';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  Input,
  NgModule,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { map } from 'rxjs';
import * as THREE from 'three';
import {
  NgtSobaStarFieldMaterialModule,
  StarFieldMaterial,
} from './star-material.directive';

const genStar = (r: number) => {
  return new THREE.Vector3().setFromSpherical(
    new THREE.Spherical(
      r,
      Math.acos(1 - Math.random() * 2),
      Math.random() * 2 * Math.PI
    )
  );
};

export interface NgtSobaStarsState {
  radius: number;
  depth: number;
  count: number;
  factor: number;
  saturation: number;
  fade: boolean;
}

@Injectable()
export class NgtSobaStarsStore extends EnhancedRxState<NgtSobaStarsState> {
  readonly attributes$ = this.select(
    selectSlice(['radius', 'depth', 'count', 'factor', 'saturation']),
    map(({ depth, count, factor, radius, saturation }) => {
      const positions: number[] = [];
      const colors: number[] = [];
      const sizes = Array.from(
        { length: count },
        () => (0.5 + 0.5 * Math.random()) * factor
      );
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
        fade: this.get('fade'),
      };
    })
  );

  constructor() {
    super();
    this.set({
      radius: 100,
      depth: 50,
      count: 5000,
      saturation: 0,
      factor: 4,
      fade: false,
    });
  }
}

@Component({
  selector: 'ngt-soba-stars',
  template: `
    <ngt-points
      #ngtPoints="ngtPoints"
      (ready)="object = ngtPoints.points"
      (animateReady)="onAnimate($event)"
    >
      <ng-container *ngIf="attributes$ | async as attributes">
        <ngt-buffer-geometry>
          <ngt-buffer-attribute
            attach="position"
            [args]="[attributes.positions, 3]"
          ></ngt-buffer-attribute>
          <ngt-buffer-attribute
            attach="color"
            [args]="[attributes.colors, 3]"
          ></ngt-buffer-attribute>
          <ngt-buffer-attribute
            attach="size"
            [args]="[attributes.sizes, 1]"
          ></ngt-buffer-attribute>
        </ngt-buffer-geometry>
        <ngt-soba-star-field-material
          #sobaStarFieldMaterial="ngtSobaStarFieldMaterial"
          (ready)="starMaterial = sobaStarFieldMaterial.material"
          [parameters]="{
            vertexColors: true,
            transparent: true,
            blending: this.blending,
            uniforms: {
              fade: { value: attributes.fade },
              time: sobaStarFieldMaterial.material?.uniforms?.time || {
                value: 0
              }
            }
          }"
        ></ngt-soba-star-field-material>
      </ng-container>
    </ngt-points>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NgtSobaExtender,
      useExisting: NgtSobaStars,
    },
    NgtSobaStarsStore,
  ],
})
export class NgtSobaStars extends NgtSobaExtender<THREE.Points> {
  readonly blending = THREE.AdditiveBlending;

  readonly attributes$ = this.sobaStarsStore.attributes$;

  starMaterial?: StarFieldMaterial;

  @Input() set radius(radius: number) {
    this.sobaStarsStore.set({ radius });
  }

  @Input() set depth(depth: number) {
    this.sobaStarsStore.set({ depth });
  }

  @Input() set count(count: number) {
    this.sobaStarsStore.set({ count });
  }

  @Input() set factor(factor: number) {
    this.sobaStarsStore.set({ factor });
  }

  @Input() set saturation(saturation: number) {
    this.sobaStarsStore.set({ saturation });
  }

  @Input() set fade(fade: boolean) {
    this.sobaStarsStore.set({ fade });
  }

  constructor(private sobaStarsStore: NgtSobaStarsStore) {
    super();
  }

  onAnimate({ clock }: NgtRender) {
    if (this.starMaterial) {
      this.starMaterial.uniforms.time.value = clock.getElapsedTime();
    }
  }
}

@NgModule({
  declarations: [NgtSobaStars],
  exports: [NgtSobaStars],
  imports: [
    NgtPointsModule,
    NgtBufferGeometryModule,
    NgtBufferAttributeModule,
    NgtSobaStarFieldMaterialModule,
    CommonModule,
  ],
})
export class NgtSobaStarsModule {}
