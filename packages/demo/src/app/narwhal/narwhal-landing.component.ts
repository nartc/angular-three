import {
  EnhancedRxState,
  makeVector3,
  NgtColorPipeModule,
  NgtCoreModule,
  NgtMathPipeModule,
  NgtRender,
  NgtRepeatModule,
  NgtStore,
} from '@angular-three/core';
import {
  NgtDirectionalLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtEffectComposerModule } from '@angular-three/postprocessing';
import { NgtDepthOfFieldModule } from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtGLTFLoaderService } from '@angular-three/soba/loaders';
import { NgtSobaEnvironmentModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { selectSlice } from '@rx-angular/state';
import { combineLatest } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-narwhal-landing',
  template: `
    <ngt-narwhal-scene [speed]="speed"></ngt-narwhal-scene>
    <ngt-narwhal-landing-overlay
      (speedChange)="speed = $event"
    ></ngt-narwhal-landing-overlay>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NarwhalLandingComponent {
  speed = 1;
}

@Component({
  selector: 'ngt-narwhal-landing-overlay',
  template: `
    <div class="top-left">
      <h1>
        Narwhal
        <br />
        Landing -
      </h1>
      <p>
        In
        <a href="https://angular-three.netlify.app" target="_blank">
          Angular & THREE.js
        </a>
      </p>
    </div>
    <div class="bottom-left">
      <p>
        Model by
        <a href="https://twitter.com/nixcodes" target="_blank">Nicole Oliver</a>
      </p>
    </div>
    <div class="bottom-right">
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        [ngModel]="speed"
        (ngModelChange)="speed = $event; speedChange.emit(speed)"
      />
    </div>
    <div class="top-right">
      <a href="https://nrwl.io" target="_blank">nrwl.io</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    // language=scss
    `
      @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&family=Montserrat:wght@400;700&display=swap');

      :host {
        font-family: 'Be Vietnam Pro', sans-serif;
        font-size: 16px;
      }

      :host p {
        margin-left: 0.5rem;
        margin-bottom: 0;
        margin-top: 0;
      }

      :host h1 {
        padding: 0;
        margin: 0 0 0.05em 0;
        font-family: Montserrat, serif;
        font-size: min(18vw, 8em);
        line-height: 0.85em;
      }

      :host .top-left {
        position: absolute;
        left: 1rem;
        top: 2rem;
      }

      :host .top-right {
        position: absolute;
        right: 1rem;
        top: 2rem;
      }

      :host .bottom-left {
        position: absolute;
        left: 1rem;
        bottom: 2rem;
      }

      :host .bottom-right {
        position: absolute;
        right: 1rem;
        bottom: 2rem;
        width: 50%;
      }

      :host .bottom-right input[type='range'] {
        display: block;
        -webkit-appearance: none;
        -moz-appearance: none;
        background: black;
        border-radius: 5px;
        width: 100%;
        height: 2px;
        outline: 0;
      }

      :host .bottom-right input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: #000;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        transition: 0.3s ease-in-out;
      }

      :host .bottom-right input[type='range']::-webkit-slider-thumb:active {
        transform: scale(1);
      }
    `,
  ],
})
export class NarwhalLandingOverlayComponent {
  speed = 1;
  @Output() speedChange = new EventEmitter<number>();
}

@Component({
  selector: 'ngt-narwhal-scene',
  template: `
    <ngt-canvas
      [gl]="{ alpha: false, antialias: false }"
      [dpr]="[1, 1.5]"
      [camera]="{ position: [0, 0, 10], fov: 20, near: 0.01, far: depth + 15 }"
      [scene]="{ background: '#e2efff' | color }"
    >
      <ngt-spot-light
        [position]="[10, 20, 10]"
        [args]="['skyblue', 3, undefined, undefined, 1]"
      ></ngt-spot-light>
      <ngt-directional-light
        [position]="[10, 20, 10]"
        [args]="['skyblue', 3]"
      ></ngt-directional-light>

      <ngt-narwhal
        *repeat="let index of count"
        [index]="index"
        [z]="(index / count | easing) * depth | math: 'round'"
        [speed]="speed"
      ></ngt-narwhal>

      <ngt-soba-environment preset="sunset"></ngt-soba-environment>
      <ngt-effect-composer [multisampling]="0">
        <ngt-depth-of-field
          [target]="[0, 0, 60]"
          [options]="{ focalLength: 0.5, bokehScale: 11, height: 700 }"
        ></ngt-depth-of-field>
      </ngt-effect-composer>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NarwhalSceneComponent {
  @Input() depth = 80;
  @Input() count = 80;
  @Input() speed = 1;
}

@Pipe({
  name: 'easing',
})
export class EasingPipe implements PipeTransform {
  transform(value: number): number {
    return Math.sqrt(1 - Math.pow(value - 1, 2));
  }
}

@Component({
  selector: 'ngt-narwhal[z][index][speed]',
  template: `
    <ng-container *ngIf="narwhal$ | async as narwhal">
      <ngt-primitive
        [object]="narwhal.scene"
        (animateReady)="onAnimate(narwhal.scene, $event)"
      ></ngt-primitive>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NarwhalComponent extends EnhancedRxState<{
  y: number;
  x: number;
  z: number;
  index: number;
  speed: number;
  spin: number;
  width: number;
  height: number;
  rX: number;
  rZ: number;
}> {
  @Input() set z(z: number) {
    this.set({ z });
  }

  @Input() set index(index: number) {
    this.set({ index });
  }

  @Input() set speed(speed: number) {
    this.set({ speed });
  }

  narwhal$ = this.gltfLoaderService.load('/assets/low-poly-narwhal.gltf');

  constructor(
    private gltfLoaderService: NgtGLTFLoaderService,
    private store: NgtStore
  ) {
    super();
  }

  ngOnInit() {
    this.set({
      // This gives us a random value between -1 and 1, we will multiply it with the viewport width
      x: THREE.MathUtils.randFloatSpread(2),
      // How fast objects spin, randFlost gives us a value between min and max, in this case 8 and 12
      spin: THREE.MathUtils.randFloat(10, 14),
      // Some random rotations, Math.PI represents 360 degrees in radian
      rX: Math.random() * Math.PI,
      rZ: Math.random() * Math.PI,
    });

    this.hold(
      combineLatest([
        this.store.select(selectSlice(['camera', 'viewport', 'ready'])),
        this.select('z'),
      ]),
      ([{ camera, viewport }, z]) => {
        const { width, height } = viewport.getCurrentViewport(
          camera,
          makeVector3([0, 0, -z])
        );

        this.set({
          y: THREE.MathUtils.randFloatSpread(height * 2),
          width,
          height,
        });
      }
    );
  }

  onAnimate(narwhal: THREE.Group, { delta, clock }: NgtRender) {
    const { index, width, height, x, z, speed, spin, y, rX, rZ } = this.get();
    if (delta < 0.1) {
      const newY = y + delta * speed;
      this.set({ y: newY });
      narwhal.position.set(index === 0 ? 0 : x * width, newY, -z);
    }

    const newRx = rX + delta / spin;
    const newRz = rZ + delta / spin;
    this.set({ rX: newRx, rZ: newRz });
    narwhal.rotation.set(
      newRx,
      Math.sin(index * 1000 + clock.elapsedTime / 10) * Math.PI,
      newRz
    );

    if (y > height * (index === 0 ? 10 : 1)) {
      this.set({ y: -(height * (index === 0 ? 10 : 1)) });
    }
  }
}

@NgModule({
  declarations: [
    NarwhalLandingComponent,
    NarwhalSceneComponent,
    NarwhalComponent,
    NarwhalLandingOverlayComponent,
    EasingPipe,
  ],
  exports: [NarwhalLandingComponent],
  imports: [
    CommonModule,
    NgtPrimitiveModule,
    NgtCoreModule,
    NgtColorPipeModule,
    NgtSpotLightModule,
    NgtSobaEnvironmentModule,
    NgtEffectComposerModule,
    NgtDepthOfFieldModule,
    NgtRepeatModule,
    NgtMathPipeModule,
    NgtDirectionalLightModule,
    NgtSobaOrbitControlsModule,
    FormsModule,
  ],
})
export class NarwhalLandingComponentModule {}
