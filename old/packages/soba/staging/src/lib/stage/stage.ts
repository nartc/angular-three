import {
  createParentObjectProvider,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtCanvasStore,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtStore,
  zonelessRequestAnimationFrame,
  zonelessSetTimeout,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  NgtAmbientLightModule,
  NgtPointLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  Inject,
  Input,
  NgModule,
  OnInit,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, Observable, startWith } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaEnvironmentModule } from '../environment/environment';
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

interface NgtSobaStageState {
  innerGroup: THREE.Group;
  outerGroup: THREE.Group;
  radius: number;
  width: number;
  height: number;
  shadows: boolean;
  adjustCamera: boolean;
  environment: PresetsType;
  intensity: number;
  ambience: number;
  // TODO: in a new major state.controls should be the only means of consuming controls, the
  // controls prop can then be removed!
  controls: ControlsProto | null;
  preset: keyof typeof presets;
  shadowBias: number;
  contactShadow:
    | {
        blur: number;
        opacity?: number;
        position?: [x: number, y: number, z: number];
      }
    | false;
}

@Directive({
  selector: 'ng-template[sobaStageContent]',
  exportAs: 'ngtSobaStageContent',
})
export class NgtSobaStageContent {
  constructor(public templateRef: TemplateRef<NgtSobaStageState>) {}
}

@Component({
  selector: 'ngt-soba-stage',
  template: `
    <ngt-group
      *ngIf="vm$ | async as vm"
      [objectInputsController]="objectInputsController"
    >
      <ngt-group (ready)="set({ outerGroup: $event })">
        <ngt-group (ready)="set({ innerGroup: $event })">
          <ng-container
            [ngTemplateOutlet]="content.templateRef"
            [ngTemplateOutletContext]="get()"
          ></ng-container>
        </ngt-group>
      </ngt-group>
      <!--      contact shadows-->
      <ngt-soba-environment [preset]="vm.environment"></ngt-soba-environment>
      <ngt-ambient-light [intensity]="vm.intensity / 3"></ngt-ambient-light>
      <ngt-spot-light
        [position]="[
          presets[vm.preset].main[0] * vm.radius,
          presets[vm.preset].main[1] * vm.radius,
          presets[vm.preset].main[2] * vm.radius
        ]"
        [args]="[undefined, vm.intensity * 2, undefined, undefined, 1]"
        [castShadow]="vm.shadows"
        [shadow]="{ bias: vm.shadowBias }"
      ></ngt-spot-light>
      <ngt-point-light
        [intensity]="vm.intensity"
        [position]="[
          presets[vm.preset].fill[0] * vm.radius,
          presets[vm.preset].fill[1] * vm.radius,
          presets[vm.preset].fill[2] * vm.radius
        ]"
      ></ngt-point-light>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    createParentObjectProvider(NgtSobaStage, (stage) =>
      stage.get('innerGroup')
    ),
  ],
})
export class NgtSobaStage
  extends NgtStore<NgtSobaStageState>
  implements OnInit
{
  @Input() set shadows(shadows: boolean) {
    this.set({ shadows });
  }

  @Input() set adjustCamera(adjustCamera: boolean) {
    this.set({ adjustCamera });
  }

  @Input() set environment(environment: PresetsType) {
    this.set({ environment });
  }

  @Input() set intensity(intensity: number) {
    this.set({ intensity });
  }

  @Input() set ambience(ambience: number) {
    this.set({ ambience });
  }

  @Input() set controls(controls: ControlsProto | null) {
    this.set({ controls });
  }

  @Input() set preset(preset: keyof typeof presets) {
    this.set({ preset });
  }

  @Input() set shadowBias(shadowBias: number) {
    this.set({ shadowBias });
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

  @ContentChild(NgtSobaStageContent, { static: true })
  content!: NgtSobaStageContent;

  @ContentChildren(NgtObjectInputsController) set children(
    v: QueryList<NgtObjectInputsController>
  ) {
    zonelessSetTimeout(() => {
      this.hold(v.changes.pipe(startWith(v)), this.calculateDimensions);
    });
  }

  private adjustCamera$ = combineLatest([
    this.canvasStore.select('controls') as unknown as Observable<ControlsProto>,
    this.select(selectSlice(['radius', 'width', 'height', 'adjustCamera'])),
  ]);

  presets = presets;
  vm$ = this.select(
    selectSlice([
      'preset',
      'environment',
      'contactShadow',
      'radius',
      'intensity',
      'shadows',
      'shadowBias',
    ])
  );

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController,
    private canvasStore: NgtCanvasStore
  ) {
    super();
    this.set({
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

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this.hold(
        this.adjustCamera$,
        ([defaultControls, { adjustCamera, radius, width, height }]) => {
          const camera = this.canvasStore.get('camera');
          if (adjustCamera) {
            const y = radius / (height > width ? 1.5 : 2.5);
            camera.position.set(0, radius * 0.5, radius * 2.5);
            camera.near = 0.1;
            camera.far = Math.max(5000, radius * 4);
            camera.lookAt(0, y, 0);

            const currentControls = defaultControls || this.get('controls');
            if (currentControls) {
              currentControls.target.set(0, y, 0);
              currentControls.update();
            }
          }
        }
      );
    });
  }

  private calculateDimensions = () => {
    const { outerGroup, innerGroup } = this.get();
    outerGroup.position.set(0, 0, 0);
    outerGroup.updateWorldMatrix(true, true);
    const box3 = new THREE.Box3().setFromObject(innerGroup);
    const center = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    const height = box3.max.y - box3.min.y;
    const width = box3.max.x - box3.min.x;
    box3.getCenter(center);
    box3.getBoundingSphere(sphere);
    this.set({ radius: sphere.radius, width, height });
    outerGroup.position.set(-center.x, -center.y + height / 2, -center.z);
  };
}

@NgModule({
  declarations: [NgtSobaStage, NgtSobaStageContent],
  exports: [NgtSobaStage, NgtSobaStageContent, NgtObjectInputsControllerModule],
  imports: [
    NgtGroupModule,
    NgtSobaEnvironmentModule,
    NgtAmbientLightModule,
    NgtSpotLightModule,
    NgtPointLightModule,
    CommonModule,
  ],
})
export class NgtSobaStageModule {}
