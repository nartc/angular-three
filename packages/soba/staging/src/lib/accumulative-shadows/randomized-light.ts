import {
  createInjectionToken,
  extend,
  injectNgtRef,
  NgtArgs,
  NgtRef,
  NgtRepeat,
  NgtRxStore,
} from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Directive, Input } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import * as THREE from 'three';
import { DirectionalLight, Group, MathUtils, OrthographicCamera, Vector2, Vector3 } from 'three';
import { injectNgtsAccumulativeApi } from './accumulative-shadows';

extend({ Group, DirectionalLight, OrthographicCamera, Vector2 });

interface NgtsRandomizedLightApi {
  /** Jiggles the lights */
  update: () => void;
}

export const [injectNgtsRandomizedLightApi, provideNgtsRandomizedLightApi] =
  createInjectionToken<NgtsRandomizedLightApi>('NgtsRandomizedLight API');

function lightsApiFactory(lights: NgtsRandomizedLight) {
  const accumulativeApi = injectNgtsAccumulativeApi();

  const update = () => {
    let light: THREE.Object3D | undefined;
    if (lights.groupRef.nativeElement) {
      for (let l = 0; l < lights.groupRef.nativeElement.children.length; l++) {
        light = lights.groupRef.nativeElement.children[l];
        if (Math.random() > lights.get('ambient')) {
          light.position.set(
            lights.get('position')[0] + MathUtils.randFloatSpread(lights.get('radius')),
            lights.get('position')[1] + MathUtils.randFloatSpread(lights.get('radius')),
            lights.get('position')[2] + MathUtils.randFloatSpread(lights.get('radius'))
          );
        } else {
          const lambda = Math.acos(2 * Math.random() - 1) - Math.PI / 2.0;
          const phi = 2 * Math.PI * Math.random();
          light.position.set(
            Math.cos(lambda) * Math.cos(phi) * lights.get('length'),
            Math.abs(Math.cos(lambda) * Math.sin(phi) * lights.get('length')),
            Math.sin(lambda) * lights.get('length')
          );
        }
      }
    }
  };

  const api = { update } as NgtsRandomizedLightApi;

  lights.effect(lights.select(selectSlice(['radius', 'ambient', 'length', 'position'])), () => {
    const group = lights.groupRef.nativeElement;
    if (accumulativeApi) accumulativeApi.lights.set(group.uuid, api);
    return () => accumulativeApi.lights.delete(group.uuid);
  });

  return api;
}

@Directive({
  selector: 'ngts-randomized-light-consumer',
  standalone: true,
})
export class RandomizedLightConsumer {
  readonly #api = injectNgtsRandomizedLightApi();
}

@Component({
  selector: 'ngts-randomized-light',
  standalone: true,
  template: `
    <ngt-group ngtCompound *ref="groupRef">
      <ngt-directional-light
        *ngFor="let i; repeat: get('amount')"
        [intensity]="get('intensity') / get('amount')"
        [castShadow]="get('castShadow')"
      >
        <ngt-value *args="[get('bias')]" attach="shadow.bias"></ngt-value>
        <ngt-vector2 *args="[get('mapSize'), get('mapSize')]" attach="shadow.mapSize"></ngt-vector2>
        <ngt-orthographic-camera
          *args="get('cameraArgs')"
          attach="shadow.camera"
        ></ngt-orthographic-camera>
      </ngt-directional-light>
      <ngts-randomized-light-consumer></ngts-randomized-light-consumer>
    </ngt-group>
  `,
  imports: [NgtRef, NgtRepeat, NgtArgs, RandomizedLightConsumer],
  providers: [provideNgtsRandomizedLightApi([NgtsRandomizedLight], lightsApiFactory)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsRandomizedLight extends NgtRxStore {
  @Input() groupRef = injectNgtRef<Group>();

  /** How many frames it will jiggle the lights, 1.
   *  Frames is context aware, if a provider like AccumulativeShadows exists, frames will be taken from there!  */
  @Input() set frames(frames: number) {
    this.set({ frames });
  }

  /** Light position, [0, 0, 0] */
  @Input() set position(position: [x: number, y: number, z: number]) {
    this.set({ position });
  }

  /** Radius of the jiggle, higher values make softer light, 5 */
  @Input() set radius(radius: number) {
    this.set({ radius });
  }

  /** Amount of lights, 8 */
  @Input() set amount(amount: number) {
    this.set({ amount });
  }

  /** Light intensity, 1 */
  @Input() set intensity(intensity: number) {
    this.set({ intensity });
  }

  /** Ambient occlusion, lower values mean less AO, hight more, you can mix AO and directional light, 0.5 */
  @Input() set ambient(ambient: number) {
    this.set({ ambient });
  }

  /** If the lights cast shadows, this is true by default */
  @Input() set castShadow(castShadow: boolean) {
    this.set({ castShadow });
  }

  /** Default shadow bias, 0 */
  @Input() set bias(bias: number) {
    this.set({ bias });
  }

  /** Default map size, 512 */
  @Input() set mapSize(mapSize: number) {
    this.set({ mapSize });
  }

  /** Default size of the shadow camera, 10 */
  @Input() set size(size: number) {
    this.set({ size });
  }

  /** Default shadow camera near, 0.5 */
  @Input() set near(near: number) {
    this.set({ near });
  }

  /** Default shadow camera far, 500 */
  @Input() set far(far: number) {
    this.set({ far });
  }

  override initialize(): void {
    super.initialize();
    this.set({
      castShadow: true,
      bias: 0.001,
      mapSize: 512,
      size: 5,
      near: 0.5,
      far: 500,
      frames: 1,
      position: [0, 0, 0],
      radius: 1,
      amount: 8,
      intensity: 1,
      ambient: 0.5,
    });
    this.connect(
      'cameraArgs',
      this.select(['size', 'near', 'far'], ({ size, near, far }) => [
        -size,
        size,
        size,
        -size,
        near,
        far,
      ])
    );
    this.connect(
      'length',
      this.select(['position'], ({ position }) => new Vector3(...position).length())
    );
  }
}
