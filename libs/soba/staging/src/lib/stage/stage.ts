import {
  AnyFunction,
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NGT_OBJECT_REF,
  NgtObjectInputs,
  NgtObjectInputsState,
  NgtObjectPassThrough,
  NumberInput,
  provideObjectHostRef,
  Ref,
} from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtGroup } from '@angular-three/core/group';
import { NgtAmbientLight, NgtPointLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  Input,
  NgModule,
  OnInit,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { asyncScheduler, combineLatest, filter, observeOn, pipe, skip, switchMap, tap } from 'rxjs';
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
};

type ControlsProto = { update(): void; target: THREE.Vector3 };

export interface NgtSobaStageState extends NgtObjectInputsState<THREE.Group> {
  outerGroup: Ref<THREE.Group>;
  innerGroup: Ref<THREE.Group>;
  radius: number;
  width: number;
  height: number;

  shadows: boolean;
  adjustCamera: boolean;
  environment: PresetsType | null;
  intensity: number;
  preset: keyof typeof presets;
  shadowBias: number;
  contactShadow:
    | {
        blur: number;
        opacity?: number;
        position?: [x: number, y: number, z: number];
      }
    | false;
  ambience?: number;
}

@Directive({
  selector: 'ng-template[ngt-soba-stage-content]',
  standalone: true,
})
export class NgtSobaStageContent {
  constructor(public templateRef: TemplateRef<{ group: Ref<THREE.Group> }>) {}

  static ngTemplateContextGuard(dir: NgtSobaStageContent, ctx: any): ctx is { group: Ref<THREE.Group> } {
    return true;
  }
}

@Component({
  selector: 'ngt-soba-stage',
  standalone: true,
  template: `
    <ngt-group [ngtObjectOutputs]="this" [ngtObjectInputs]="this" skipParent>
      <ngt-group [ref]="outerGroup">
        <ngt-group [ref]="innerGroup">
          <ng-container
            *ngIf="content"
            [ngTemplateOutlet]="content.templateRef"
            [ngTemplateOutletContext]="{ group: innerGroup }"
          ></ng-container>
        </ngt-group>
      </ngt-group>

      <ngt-soba-contact-shadows
        *ngIf="contactShadow"
        [scale]="radius * 2"
        [far]="radius / 2"
        [blur]="contactShadow.blur"
        [opacity]="contactShadow.opacity"
        [position]="contactShadow.position"
      ></ngt-soba-contact-shadows>

      <ngt-soba-environment *ngIf="environment" [preset]="environment"></ngt-soba-environment>

      <ngt-ambient-light [intensity]="intensity / 3"></ngt-ambient-light>
      <ngt-spot-light
        penumbra="1"
        [position]="[config.main[0] * radius, config.main[1] * radius, config.main[2] * radius]"
        [intensity]="intensity * 2"
        [castShadow]="shadows"
      >
        <ngt-value [attach]="['shadow', 'bias']" [value]="shadowBias"></ngt-value>
      </ngt-spot-light>
      <ngt-point-light
        [position]="[config.fill[0] * radius, config.fill[1] * radius, config.fill[2] * radius]"
        [intensity]="intensity"
      ></ngt-point-light>
    </ngt-group>
  `,
  imports: [
    NgtGroup,
    NgtObjectPassThrough,
    NgtSobaContactShadows,
    NgtSobaEnvironment,
    NgtAmbientLight,
    NgtSpotLight,
    NgtPointLight,
    NgtValueAttribute,
    NgIf,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaStage, (stage) => stage.innerGroup)],
})
export class NgtSobaStage extends NgtObjectInputs<THREE.Group, NgtSobaStageState> implements OnInit, AfterContentInit {
  get shadows() {
    return this.get((s) => s.shadows);
  }
  @Input() set shadows(shadows: BooleanInput) {
    this.set({ shadows: coerceBooleanProperty(shadows) });
  }

  get adjustCamera() {
    return this.get((s) => s.adjustCamera);
  }
  @Input() set adjustCamera(adjustCamera: BooleanInput) {
    this.set({ adjustCamera: coerceBooleanProperty(adjustCamera) });
  }

  get environment() {
    return this.get((s) => s.environment);
  }
  @Input() set environment(environment: PresetsType | null) {
    this.set({ environment });
  }

  get intensity(): number {
    return this.get((s) => s.intensity);
  }
  @Input() set intensity(intensity: NumberInput) {
    this.set({ intensity: coerceNumberProperty(intensity) });
  }

  get ambience() {
    return this.get((s) => s.ambience);
  }
  @Input() set ambience(ambience: NumberInput) {
    this.set({ ambience: coerceNumberProperty(ambience) });
  }

  get preset() {
    return this.get((s) => s.preset);
  }
  @Input() set preset(preset: keyof typeof presets) {
    this.set({ preset });
  }

  get shadowBias() {
    return this.get((s) => s.shadowBias);
  }
  @Input() set shadowBias(shadowBias: NumberInput) {
    this.set({ shadowBias: coerceNumberProperty(shadowBias) });
  }

  get contactShadow() {
    return this.get((s) => s.contactShadow);
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

  @ContentChild(NgtSobaStageContent) content?: NgtSobaStageContent;
  @ContentChildren(NGT_OBJECT_REF) children!: QueryList<AnyFunction>;

  get innerGroup() {
    return this.get((s) => s.innerGroup);
  }

  get outerGroup() {
    return this.get((s) => s.outerGroup);
  }

  get radius() {
    return this.get((s) => s.radius);
  }

  get width() {
    return this.get((s) => s.width);
  }

  get height() {
    return this.get((s) => s.height);
  }

  get config() {
    return presets[this.get((s) => s.preset)];
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      innerGroup: new Ref(),
      outerGroup: new Ref(),
      radius: 0,
      width: 0,
      height: 0,
      shadows: state.shadows ?? true,
      adjustCamera: state.adjustCamera ?? true,
      environment: state.environment ?? 'city',
      intensity: state.intensity ?? 1,
      preset: state.preset ?? 'rembrandt',
      shadowBias: state.shadowBias ?? 0,
      contactShadow: state.contactShadow ?? {
        blur: 2,
        opacity: 0.5,
        position: [0, 0, 0],
      },
    }));
  }

  ngAfterContentInit() {
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.setDimensions(
          this.select(
            this.innerGroup.pipe(filter((group) => !!group)),
            this.outerGroup.pipe(filter((group) => !!group)),
            this.children.changes.pipe(switchMap(() => combineLatest(this.children.map((child) => child()))))
          )
        );

        this.updateControls(
          this.select(
            this.store.select((s) => s.controls),
            this.select((s) => s.radius).pipe(skip(1)),
            this.select((s) => s.height).pipe(skip(1)),
            this.select((s) => s.width).pipe(skip(1)),
            this.select((s) => s.adjustCamera)
          )
        );
      });
    });
  }

  private readonly setDimensions = this.effect(
    pipe(
      observeOn(asyncScheduler),
      tap(() => {
        const { innerGroup, outerGroup } = this.get();
        if (innerGroup.value && outerGroup.value) {
          outerGroup.value.position.set(0, 0, 0);
          outerGroup.value.updateWorldMatrix(true, true);
          const box3 = new THREE.Box3().setFromObject(innerGroup.value);
          const center = new THREE.Vector3();
          const sphere = new THREE.Sphere();
          const height = box3.max.y - box3.min.y;
          const width = box3.max.x - box3.min.x;
          box3.getCenter(center);
          box3.getBoundingSphere(sphere);

          this.zone.run(() => {
            this.set({ radius: sphere.radius, width, height });
          });

          outerGroup.value.position.set(-center.x, -center.y + height / 2, -center.z);
        }
      })
    )
  );

  private readonly updateControls = this.effect(
    tap(() => {
      const { adjustCamera, width, height, radius } = this.get();
      const { camera, controls } = this.store.get();
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
}

@NgModule({
  imports: [NgtSobaStage, NgtSobaStageContent],
  exports: [NgtSobaStage, NgtSobaStageContent],
})
export class NgtSobaStageModule {}
