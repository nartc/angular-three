import { NgtArgs, NgtPush } from '@angular-three/core';
import {
  NgtsGizmoHelper,
  NgtsGizmoViewcube,
  NgtsGizmoViewport,
} from '@angular-three/soba/abstractions';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { map } from 'rxjs';
import { StorybookSetup } from '../setup-canvas';

const alignment = [
  'top-left',
  'top-right',
  'bottom-right',
  'bottom-left',
  'bottom-center',
  'center-right',
  'center-left',
  'center-center',
  'top-center',
];
const controls = ['OrbitControls', 'TrackballControls'];
const faces = ['Right', 'Left', 'Top', 'Bottom', 'Front', 'Back'];
const gizmos = ['GizmoViewcube', 'GizmoViewport'];

const args = {
  alignment: alignment[2],
  color: 'white',
  colorX: 'red',
  colorY: 'green',
  colorZ: 'blue',
  controls: controls[0],
  faces,
  gizmo: gizmos[0],
  hideNegativeAxes: false,
  hoverColor: 'lightgray',
  labelColor: 'black',
  marginX: 80,
  marginY: 80,
  opacity: 1,
  strokeColor: 'gray',
  textColor: 'black',
};

@Component({
  selector: 'storybook-default-gizmo-helper',
  standalone: true,
  template: `
    <ngt-primitive *args="[model$ | ngtPush : null]" scale="0.01" />
    <ngts-gizmo-helper [alignment]="alignment" [margin]="[marginX, marginY]">
        <ng-template ngtsGizmoHelperContent>
      <ngts-gizmo-viewcube
        *ngIf="gizmo === 'GizmoViewcube'; else viewport"
        [color]="color"
        [faces]="faces"
        [hoverColor]="hoverColor"
        [strokeColor]="strokeColor"
        [textColor]="textColor"
        [opacity]="opacity"
      />
      <ng-template #viewport>
        <ngts-gizmo-viewport
        [axisColors]="[colorX, colorY, colorZ]"
        [hideNegativeAxes]="hideNegativeAxes"
        [labelColor]="labelColor"
        ></ngts-gizmo-viewport>
      </ng-template>
        </ng-template>
    </ngts-gizmo-helper>
    <ngts-orbit-controls [makeDefault]="true" />
  `,
  imports: [
    NgtsGizmoHelper,
    NgtsGizmoViewcube,
    NgtsGizmoViewport,
    NgtArgs,
    NgtPush,
    NgIf,
    NgtsOrbitControls,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultGizmoHelperStory {
  readonly model$ = injectNgtsGLTFLoader('soba/assets/LittlestTokyo.glb').pipe(
    map((node) => node.scene)
  );
  @Input() alignment = args.alignment;
  @Input() marginX = args.marginX;
  @Input() marginY = args.marginY;
  @Input() gizmo = args.gizmo;

  @Input() color = args.color;
  @Input() faces = args.faces;
  @Input() hoverColor = args.hoverColor;
  @Input() opacity = args.opacity;
  @Input() strokeColor = args.strokeColor;
  @Input() textColor = args.textColor;

  @Input() controls = args.controls;
  @Input() colorX = args.colorX;
  @Input() colorZ = args.colorZ;
  @Input() colorY = args.colorY;
  @Input() labelColor = args.labelColor;
  @Input() hideNegativeAxes = args.hideNegativeAxes;
}

export default {
  title: 'Gizmo/GizmoHelper',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

const colorArgType = { control: { type: 'color' } };
const generalTable = { table: { categry: 'General' } };
const helperTable = { table: { category: 'GizmoHelper' } };
const viewcubeTable = { table: { category: 'GizmoViewcube' } };
const viewportTable = { table: { category: 'GizmoViewport' } };

const argTypes = {
  alignment: { control: { type: 'select' }, options: alignment, ...helperTable },
  color: { ...colorArgType, ...viewcubeTable },
  colorX: { ...colorArgType, ...viewportTable },
  colorY: { ...colorArgType, ...viewportTable },
  colorZ: { ...colorArgType, ...viewportTable },
  controls: {
    control: { type: 'select' },
    name: 'Controls',
    options: controls,
    ...generalTable,
  },
  faces: {
    control: { type: 'array' },
    options: faces,
    ...viewcubeTable,
  },
  gizmo: {
    control: { type: 'select' },
    name: 'Gizmo',
    options: gizmos,
    ...generalTable,
  },
  hideNegativeAxes: { ...viewportTable },
  hoverColor: { ...viewportTable },
  labelColor: { ...viewportTable },
  marginX: { ...helperTable },
  marginY: { ...helperTable },
  opacity: {
    control: { min: 0, max: 1, step: 0.01, type: 'range' },
    ...viewcubeTable,
  },
  strokeColor: { ...colorArgType, ...viewcubeTable },
  textColor: { ...colorArgType, ...viewcubeTable },
};

export const Default: Story = (args) => ({
  props: {
    storyComponent: DefaultGizmoHelperStory,
    storyInputs: args,
    controls: false,
    camera: { position: [0, 0, 10] },
  },
  template: `
<storybook-setup [storyComponent]="storyComponent" [storyInputs]="storyInputs" [controls]="controls" [camera]="camera" />
    `,
});

Default.args = args;
Default.argTypes = argTypes;
