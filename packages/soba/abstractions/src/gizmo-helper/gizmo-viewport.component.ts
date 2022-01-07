import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtEvent,
  NgtMathPipeModule,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtSobaExtender,
  NgtStore,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  NgtAmbientLightModule,
  NgtPointLightModule,
} from '@angular-three/core/lights';
import {
  NgtMeshBasicMaterialModule,
  NgtSpriteMaterialModule,
} from '@angular-three/core/materials';
import { NgtSpriteModule } from '@angular-three/core/sprites';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaGizmoHelperStore } from './gizmo-helper.store';

@Component({
  selector: 'ngt-soba-gizmo-viewport',
  template: `
    <ngt-group
      *ngIf="gizmo$ | async as gizmo"
      (ready)="object = $event; object.scale.set(40, 40, 40)"
      (animateReady)="animateReady.emit({ entity: object, state: $event })"
      [appendTo]="gizmo"
      [object3dInputsController]="objectInputsController"
    >
      <ngt-soba-gizmo-axis
        [color]="axisColors[0]"
        [rotation]="[0, 0, 0]"
        [scale]="axisScale"
      ></ngt-soba-gizmo-axis>
      <ngt-soba-gizmo-axis
        [color]="axisColors[1]"
        [rotation]="[0, 0, 0.5 | mathConst: 'PI']"
        [scale]="axisScale"
      ></ngt-soba-gizmo-axis>
      <ngt-soba-gizmo-axis
        [color]="axisColors[2]"
        [rotation]="[0, -0.5 | mathConst: 'PI', 0]"
        [scale]="axisScale"
      ></ngt-soba-gizmo-axis>
      <ng-container *ngIf="!hideAxisHeads">
        <ng-container *ngIf="{ raycast: raycast$ | async } as vm">
          <ngt-soba-gizmo-axis-head
            [arcStyle]="axisColors[0]"
            [position]="[1, 0, 0]"
            [label]="labels[0]"
            [font]="font"
            [disabled]="disabled"
            [labelColor]="labelColor"
            [raycast]="vm.raycast"
            [axisHeadScale]="axisHeadScale"
          ></ngt-soba-gizmo-axis-head>
          <ngt-soba-gizmo-axis-head
            [arcStyle]="axisColors[1]"
            [position]="[0, 1, 0]"
            [label]="labels[1]"
            [font]="font"
            [disabled]="disabled"
            [labelColor]="labelColor"
            [raycast]="vm.raycast"
            [axisHeadScale]="axisHeadScale"
          ></ngt-soba-gizmo-axis-head>
          <ngt-soba-gizmo-axis-head
            [arcStyle]="axisColors[2]"
            [position]="[0, 0, 1]"
            [label]="labels[2]"
            [font]="font"
            [disabled]="disabled"
            [labelColor]="labelColor"
            [raycast]="vm.raycast"
            [axisHeadScale]="axisHeadScale"
          ></ngt-soba-gizmo-axis-head>

          <ng-container *ngIf="!hideNegativeAxes">
            <ngt-soba-gizmo-axis-head
              [arcStyle]="axisColors[0]"
              [position]="[-1, 0, 0]"
              [font]="font"
              [disabled]="disabled"
              [labelColor]="labelColor"
              [raycast]="vm.raycast"
              [axisHeadScale]="axisHeadScale"
            ></ngt-soba-gizmo-axis-head>
            <ngt-soba-gizmo-axis-head
              [arcStyle]="axisColors[1]"
              [position]="[0, -1, 0]"
              [font]="font"
              [disabled]="disabled"
              [labelColor]="labelColor"
              [raycast]="vm.raycast"
              [axisHeadScale]="axisHeadScale"
            ></ngt-soba-gizmo-axis-head>
            <ngt-soba-gizmo-axis-head
              [arcStyle]="axisColors[2]"
              [position]="[0, 0, -1]"
              [font]="font"
              [disabled]="disabled"
              [labelColor]="labelColor"
              [raycast]="vm.raycast"
              [axisHeadScale]="axisHeadScale"
            ></ngt-soba-gizmo-axis-head>
          </ng-container>
        </ng-container>
      </ng-container>
      <ngt-ambient-light [intensity]="0.5"></ngt-ambient-light>
      <ngt-point-light
        [intensity]="0.5"
        [position]="[10, 10, 10]"
      ></ngt-point-light>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    { provide: NgtSobaExtender, useExisting: NgtSobaGizmoViewport },
  ],
})
export class NgtSobaGizmoViewport extends NgtSobaExtender<THREE.Group> {
  @Input() axisColors: [string, string, string] = [
    '#ff3653',
    '#0adb50',
    '#2c8fdf',
  ];
  @Input() labels: [string, string, string] = ['X', 'Y', 'Z'];
  @Input() labelColor = '#000';
  @Input() font = '18px Inter var, Arial, sans-serif';
  @Input() axisHeadScale = 1;
  @Input() hideNegativeAxes = false;
  @Input() hideAxisHeads = false;
  @Input() disabled = false;
  @Input() axisScale?: [number, number, number];

  @Output() click = new EventEmitter<NgtEvent<PointerEvent>>();

  readonly gizmo$ = this.gizmoHelperStore.select('gizmo');
  readonly raycast$ = this.gizmoHelperStore.select('raycast');

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    private gizmoHelperStore: NgtSobaGizmoHelperStore
  ) {
    super();
  }
}

@Component({
  selector: 'ngt-soba-gizmo-axis[color][rotation]',
  template: `
    <ngt-group
      (ready)="object = $event"
      (animateReady)="animateReady.emit({ entity: object, state: $event })"
      [rotation]="rotation"
    >
      <ngt-soba-box [args]="scale" [position]="[0.4, 0, 0]">
        <ngt-mesh-basic-material
          [parameters]="{ color, toneMapped: false }"
        ></ngt-mesh-basic-material>
      </ngt-soba-box>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NgtSobaExtender, useExisting: NgtSobaGizmoAxis }],
})
export class NgtSobaGizmoAxis extends NgtSobaExtender<THREE.Group> {
  @Input() color!: string;
  @Input() rotation!: [number, number, number];

  @Input() set scale(v: [number, number, number] | undefined) {
    this.#scale = v || this.#scale;
  }

  get scale() {
    return this.#scale;
  }

  #scale: [number, number, number] = [0.8, 0.05, 0.05];
}

@Component({
  selector: 'ngt-soba-gizmo-axis-head',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ngt-sprite-material
        #spriteMaterial="ngtSpriteMaterial"
        [parameters]="{
          map: vm.texture,
          opacity: vm.opacity,
          toneMapped: false,
          alphaTest: 0.3
        }"
      ></ngt-sprite-material>
      <ngt-sprite
        (ready)="object = $event"
        (animateReady)="animateReady.emit({ entity: object, state: $event })"
        (pointerover)="onAxisHeadPointerOver($event)"
        (pointerout)="onAxisHeadPointerOut($event)"
        (pointerdown)="onAxisHeadPointerDown($event)"
        [scale]="vm.scale"
        [material]="spriteMaterial.material"
        [object3dInputsController]="objectInputsController"
      ></ngt-sprite>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    EnhancedRxState,
    { provide: NgtSobaExtender, useExisting: NgtSobaGizmoAxisHead },
  ],
})
export class NgtSobaGizmoAxisHead extends NgtSobaExtender<THREE.Sprite> {
  @Input() set arcStyle(arcStyle: string) {
    this.state.set({ arcStyle });
  }

  @Input() set label(label: string) {
    this.state.set({ label });
  }

  @Input() set labelColor(labelColor: string) {
    this.state.set({ labelColor });
  }

  @Input() set axisHeadScale(axisHeadScale: number) {
    this.state.set({ axisHeadScale });
  }

  @Input() set disabled(disabled: boolean) {
    this.state.set({ disabled: disabled || false });
  }

  @Input() set font(font: string) {
    this.state.set({ font });
  }

  readonly #changes$ = this.state.select(
    selectSlice(['arcStyle', 'label', 'labelColor', 'font'])
  );

  readonly vm$ = combineLatest([
    this.state.select(
      selectSlice(['active', 'label', 'axisHeadScale', 'texture'])
    ),
    this.store.select('renderer'),
  ]).pipe(
    map(([{ texture, label, active, axisHeadScale }, renderer]) => {
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy() || 1;
      return {
        texture,
        scale: (label ? 1 : 0.75) * (active ? 1.2 : 1) * axisHeadScale,
        opacity: label ? 1 : 0.75,
      };
    })
  );

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    @Inject(DOCUMENT) document: Document,
    private gizmoViewport: NgtSobaGizmoViewport,
    private gizmoHelperStore: NgtSobaGizmoHelperStore,
    private store: NgtStore,
    private state: EnhancedRxState<{
      arcStyle: string;
      labelColor: string;
      axisHeadScale: number;
      disabled: boolean;
      font: string;
      texture: THREE.CanvasTexture;
      active: boolean;
      label: string;
    }>
  ) {
    super();
    this.state.set({
      label: '',
      active: false,
      disabled: false,
    });

    this.state.connect(
      'texture',
      this.#changes$,
      (_, { label, labelColor, arcStyle, font }) => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;

        const context = canvas.getContext('2d')!;
        context.beginPath();
        context.arc(32, 32, 16, 0, 2 * Math.PI);
        context.closePath();
        context.fillStyle = arcStyle;
        context.fill();

        if (label) {
          context.font = font;
          context.textAlign = 'center';
          context.fillStyle = labelColor;
          context.fillText(label, 32, 41);
        }

        return new THREE.CanvasTexture(canvas);
      }
    );
  }

  onAxisHeadPointerOver($event: NgtEvent<PointerEvent>) {
    if (!this.state.get('disabled')) {
      $event.stopPropagation();
      this.state.set({ active: true });
    }
  }

  onAxisHeadPointerOut($event: NgtEvent<PointerEvent>) {
    if (!this.state.get('disabled')) {
      if (this.gizmoViewport.click.observed) {
        this.gizmoViewport.click.emit($event);
      } else {
        $event.stopPropagation();
        this.state.set({ active: false });
      }
    }
  }

  onAxisHeadPointerDown($event: NgtEvent<PointerEvent>) {
    if (!this.state.get('disabled')) {
      $event.stopPropagation();
      this.gizmoHelperStore.tweenCamera($event.object.position);
    }
  }
}

@NgModule({
  declarations: [NgtSobaGizmoViewport, NgtSobaGizmoAxis, NgtSobaGizmoAxisHead],
  exports: [NgtSobaGizmoViewport, NgtObject3dInputsControllerModule],
  imports: [
    CommonModule,
    NgtGroupModule,
    NgtSobaBoxModule,
    NgtMeshBasicMaterialModule,
    NgtSpriteModule,
    NgtSpriteMaterialModule,
    NgtMathPipeModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
  ],
})
export class NgtSobaGizmoViewportModule {}
