import {
  coerceBoolean,
  coerceNumber,
  getInstanceLocalState,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObjectPassThrough,
  NgtObservableInput,
  NgtRef,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtAmbientLight, NgtPointLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtGroup } from '@angular-three/core/objects';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { animationFrameScheduler, filter, isObservable, map, observeOn, switchMap, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaContactShadows } from '../contact-shadows/contact-shadows';
import { NgtSobaEnvironment } from '../environment/environment';
import { PresetsType } from '../environment/presets';

const presets = {
  rembrandt: {
    main: [1, 2, 1],
    fill: [-2, -0.5, -2],
  },
  portrait: {
    main: [-1, 2, 0.5],
    fill: [-1, 0.5, -1.5],
  },
  upfront: {
    main: [0, 2, 1],
    fill: [-1, 0.5, -1.5],
  },
  soft: {
    main: [-2, 4, 4],
    fill: [-1, 0.5, -1.5],
  },
} as const;

type ControlsProto = { update(): void; target: THREE.Vector3 };

@Component({
  selector: 'ngt-soba-stage',
  standalone: true,
  template: `
    <ngt-group shouldPassThroughRef [ngtObjectPassThrough]="this" skipWrapper>
      <ngt-group [ref]="outerGroup">
        <ngt-group [ref]="innerGroup">
          <ng-content></ng-content>
        </ngt-group>
      </ngt-group>

      <ngt-soba-contact-shadows
        *ngIf="contactShadowProps$ | async as contactShadowProps"
        [scale]="contactShadowProps['scale']"
        [far]="contactShadowProps['far']"
        [blur]="contactShadowProps['blur']"
        [opacity]="contactShadowProps['opacity']"
        [position]="contactShadowProps['position']"
      ></ngt-soba-contact-shadows>

      <ngt-soba-environment
        *ngIf="read('environment') | async as environment"
        [preset]="environment"
      ></ngt-soba-environment>

      <ng-container *ngIf="lightsProps$ | async as lightsProps">
        <ngt-ambient-light [intensity]="lightsProps['ambientLight']['intensity']"></ngt-ambient-light>
        <ngt-spot-light
          penumbra="1"
          [position]="lightsProps['spotLight']['position']"
          [intensity]="lightsProps['spotLight']['intensity']"
          [castShadow]="lightsProps['spotLight']['castShadow']"
        >
          <ngt-value [attach]="['shadow', 'bias']" [value]="lightsProps['spotLight']['shadowBias']"></ngt-value>
        </ngt-spot-light>
        <ngt-point-light
          [intensity]="lightsProps['pointLight']['intensity']"
          [position]="lightsProps['pointLight']['position']"
        ></ngt-point-light>
      </ng-container>
    </ngt-group>
  `,
  imports: [
    NgtGroup,
    NgtObjectPassThrough,
    NgtSobaContactShadows,
    NgIf,
    AsyncPipe,
    NgtSobaEnvironment,
    NgtAmbientLight,
    NgtSpotLight,
    NgtValueAttribute,
    NgtPointLight,
  ],
  providers: [
    provideNgtObject(NgtSobaStage),
    provideObjectRef(NgtSobaStage, (stage) => stage.innerGroup),
    provideObjectHostRef(NgtSobaStage),
  ],
})
export class NgtSobaStage extends NgtGroup {
  override isWrapper = true;

  @Input() set shadows(shadows: NgtObservableInput<NgtBooleanInput>) {
    this.set({ shadows: isObservable(shadows) ? shadows.pipe(map(coerceBoolean)) : coerceBoolean(shadows) });
  }

  @Input() set adjustCamera(adjustCamera: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      adjustCamera: isObservable(adjustCamera) ? adjustCamera.pipe(map(coerceBoolean)) : coerceBoolean(adjustCamera),
    });
  }

  @Input() set environment(environment: NgtObservableInput<PresetsType | null>) {
    this.set({ environment });
  }

  @Input() set intensity(intensity: NgtObservableInput<NgtNumberInput>) {
    this.set({ intensity: isObservable(intensity) ? intensity.pipe(map(coerceNumber)) : coerceNumber(intensity) });
  }

  @Input() set ambience(ambience: NgtObservableInput<NgtNumberInput>) {
    this.set({ ambience: isObservable(ambience) ? ambience.pipe(map(coerceNumber)) : coerceNumber(ambience) });
  }

  @Input() set preset(preset: NgtObservableInput<keyof typeof presets>) {
    this.set({ preset });
  }

  @Input() set shadowBias(shadowBias: NgtObservableInput<NgtNumberInput>) {
    this.set({ shadowBias: isObservable(shadowBias) ? shadowBias.pipe(map(coerceNumber)) : coerceNumber(shadowBias) });
  }

  @Input() set contactShadow(
    contactShadow:
      | {
          blur: number;
          opacity?: number;
          position?: [x: number, y: number, z: number];
        }
      | false
  ) {
    this.set({ contactShadow });
  }

  readonly contactShadowProps$ = this.select(
    this.select((s) => s['radius']),
    this.select((s) => s['contactShadow']),
    (radius, contactShadow) =>
      typeof contactShadow === 'boolean'
        ? contactShadow
        : {
            ...contactShadow,
            scale: radius * 2,
            far: radius / 2,
          }
  );

  readonly lightsProps$ = this.select(
    this.select((s) => s['intensity']),
    this.select((s) => s['radius']),
    this.select((s) => s['preset']),
    this.select((s) => s['shadows']),
    this.select((s) => s['shadowBias']),
    (intensity, radius, preset, shadows, shadowBias) => {
      const config = presets[preset as keyof typeof presets];
      return {
        ambientLight: {
          intensity: intensity / 3,
        },
        spotLight: {
          intensity: intensity * 2,
          castShadow: shadows,
          shadowBias,
          position: [config.main[0] * radius, config.main[1] * radius, config.main[2] * radius],
        },
        pointLight: {
          intensity,
          position: [config.fill[0] * radius, config.fill[1] * radius, config.fill[2] * radius],
        },
      };
    },
    { debounce: true }
  );

  get innerGroup(): NgtRef<THREE.Group> {
    return this.getState((s) => s['innerGroup']);
  }

  get outerGroup(): NgtRef<THREE.Group> {
    return this.getState((s) => s['outerGroup']);
  }

  get config() {
    return presets[this.getState((s) => s['preset']) as keyof typeof presets];
  }

  private readonly setPosition = this.effect(
    tap(() => {
      this.outerGroup.value.position.set(0, 0, 0);
      this.outerGroup.value.updateWorldMatrix(true, true);

      const box3 = new THREE.Box3().setFromObject(this.innerGroup.value);
      const center = new THREE.Vector3();
      const sphere = new THREE.Sphere();
      const height = box3.max.y - box3.min.y;
      const width = box3.max.x - box3.min.x;
      box3.getCenter(center);
      box3.getBoundingSphere(sphere);
      this.zone.run(() => {
        this.set({ width, height, radius: sphere.radius });
      });
      this.outerGroup.value.position.set(-center.x, -center.y + height / 2, -center.z);
    })
  );

  private readonly adjustCameraPosition = this.effect(
    tap(() => {
      const { adjustCamera, radius, width, height } = this.getState();
      const { camera, controls } = this.store.getState();

      if (adjustCamera) {
        const y = radius / (height > width ? 1.5 : 2.5);
        camera.position.set(0, radius * 0.5, radius * 2.5);
        camera.near = 0.1;
        camera.far = Math.max(5000, radius * 4);
        camera.lookAt(0, y, 0);
        if (controls) {
          (controls as unknown as ControlsProto).target.set(0, y, 0);
          (controls as unknown as ControlsProto).update();
        }
      }
    })
  );

  override initialize() {
    super.initialize();
    this.set({
      innerGroup: new NgtRef(),
      outerGroup: new NgtRef(),

      radius: 0,
      width: 0,
      height: 0,

      shadows: true,
      adjustCamera: true,
      environment: 'city',
      intensity: 1,
      preset: 'rembrandt',
      shadowBias: 0,
      contactShadow: {
        blur: 2,
        opacity: 0.5,
        position: [0, 0, 0],
      },
    });
  }

  override postInit() {
    super.postInit();
    const innerGroup$ = this.innerGroup.pipe(filter((innerGroup) => innerGroup != null));
    this.setPosition(
      this.select(
        innerGroup$,
        innerGroup$.pipe(
          switchMap((innerGroup) => getInstanceLocalState(innerGroup)!.objectsRefs),
          filter((objects) => objects.length > 0),
          observeOn(animationFrameScheduler)
        ),
        this.outerGroup.pipe(filter((outerGroup) => outerGroup != null)),
        this.defaultProjector,
        { debounce: true }
      )
    );
    this.adjustCameraPosition(
      this.select(
        this.store.select((s) => s.controls),
        this.select((s) => s['radius']),
        this.select((s) => s['height']),
        this.select((s) => s['width']),
        this.select((s) => s['adjustCamera']),
        this.defaultProjector,
        { debounce: true }
      )
    );
  }
}
