import {
  coerceBoolean,
  coerceNumber,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObjectPassThrough,
  NgtRadianPipe,
  NgtTriple,
} from '@angular-three/core';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtGroup } from '@angular-three/core/objects';
import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgtSobaGizmoViewportAxis, NgtSobaGizmoViewportAxisHead } from './gizmo-viewport-axis';

@Component({
  selector: 'ngt-soba-gizmo-viewport',
  standalone: true,
  template: `
    <ngt-group [ngtObjectPassThrough]="this" [scale]="40">
      <ngt-soba-gizmo-viewport-axis
        [color]="axisColors[0]"
        [rotation]="[0, 0, 0]"
        [scale]="axisScale"
      ></ngt-soba-gizmo-viewport-axis>
      <ngt-soba-gizmo-viewport-axis
        [color]="axisColors[1]"
        [rotation]="[0, 0, 90 | radian]"
        [scale]="axisScale"
      ></ngt-soba-gizmo-viewport-axis>
      <ngt-soba-gizmo-viewport-axis
        [color]="axisColors[2]"
        [rotation]="[0, -90 | radian, 0]"
        [scale]="axisScale"
      ></ngt-soba-gizmo-viewport-axis>

      <ng-container *ngIf="!hideAxisHeads">
        <ngt-soba-gizmo-viewport-axis-head
          [arcStyle]="axisColors[0]"
          [position]="[1, 0, 0]"
          [label]="labels[0]"
          [labelColor]="labelColor"
          [font]="font"
          [disabled]="disabled"
          [axisHeadScale]="axisHeadScale"
        ></ngt-soba-gizmo-viewport-axis-head>
        <ngt-soba-gizmo-viewport-axis-head
          [arcStyle]="axisColors[1]"
          [position]="[0, 1, 0]"
          [label]="labels[1]"
          [labelColor]="labelColor"
          [font]="font"
          [disabled]="disabled"
          [axisHeadScale]="axisHeadScale"
        ></ngt-soba-gizmo-viewport-axis-head>
        <ngt-soba-gizmo-viewport-axis-head
          [arcStyle]="axisColors[2]"
          [position]="[0, 0, 1]"
          [label]="labels[2]"
          [labelColor]="labelColor"
          [font]="font"
          [disabled]="disabled"
          [axisHeadScale]="axisHeadScale"
        ></ngt-soba-gizmo-viewport-axis-head>
        <ng-container *ngIf="!hideNegativeAxes">
          <ngt-soba-gizmo-viewport-axis-head
            [arcStyle]="axisColors[0]"
            [position]="[-1, 0, 0]"
            [labelColor]="labelColor"
            [font]="font"
            [disabled]="disabled"
            [axisHeadScale]="axisHeadScale"
          ></ngt-soba-gizmo-viewport-axis-head>
          <ngt-soba-gizmo-viewport-axis-head
            [arcStyle]="axisColors[1]"
            [position]="[0, -1, 0]"
            [labelColor]="labelColor"
            [font]="font"
            [disabled]="disabled"
            [axisHeadScale]="axisHeadScale"
          ></ngt-soba-gizmo-viewport-axis-head>
          <ngt-soba-gizmo-viewport-axis-head
            [arcStyle]="axisColors[2]"
            [position]="[0, 0, -1]"
            [labelColor]="labelColor"
            [font]="font"
            [disabled]="disabled"
            [axisHeadScale]="axisHeadScale"
          ></ngt-soba-gizmo-viewport-axis-head>
        </ng-container>
      </ng-container>

      <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
      <ngt-point-light [position]="10" intensity="0.5"></ngt-point-light>
    </ngt-group>
  `,
  imports: [
    NgtGroup,
    NgtObjectPassThrough,
    NgtSobaGizmoViewportAxis,
    NgtSobaGizmoViewportAxisHead,
    NgtRadianPipe,
    NgtAmbientLight,
    NgtPointLight,
    NgIf,
  ],
})
export class NgtSobaGizmoViewport extends NgtGroup {
  override isWrapper = true;

  @Input() set axisColors(axisColors: [string, string, string]) {
    this.set({ axisColors });
  }
  get axisColors() {
    return this.getState((s) => s['axisColors']);
  }

  @Input() set axisScale(axisScale: NgtTriple) {
    this.set({ axisScale });
  }
  get axisScale() {
    return this.getState((s) => s['axisScale']);
  }

  @Input() set labels(labels: [string, string, string]) {
    this.set({ labels });
  }
  get labels() {
    return this.getState((s) => s['labels']);
  }

  @Input() set axisHeadScale(axisHeadScale: NgtNumberInput) {
    this.set({ axisHeadScale: coerceNumber(axisHeadScale) });
  }
  get axisHeadScale() {
    return this.getState((s) => s['axisHeadScale']);
  }

  @Input() set labelColor(labelColor: string) {
    this.set({ labelColor });
  }
  get labelColor() {
    return this.getState((s) => s['labelColor']);
  }

  @Input() set hideNegativeAxes(hideNegativeAxes: NgtBooleanInput) {
    this.set({ hideNegativeAxes: coerceBoolean(hideNegativeAxes) });
  }
  get hideNegativeAxes() {
    return this.getState((s) => s['hideNegativeAxes']);
  }

  @Input() set hideAxisHeads(hideAxisHeads: NgtBooleanInput) {
    this.set({ hideAxisHeads: coerceBoolean(hideAxisHeads) });
  }
  get hideAxisHeads() {
    return this.getState((s) => s['hideAxisHeads']);
  }

  @Input() set disabled(disabled: NgtBooleanInput) {
    this.set({ disabled: coerceBoolean(disabled) });
  }
  get disabled() {
    return this.getState((s) => s['disabled']);
  }

  @Input() set font(font: string) {
    this.set({ font });
  }
  get font() {
    return this.getState((s) => s['font']);
  }

  override initialize() {
    super.initialize();
    this.set({
      font: '18px Inter var, Arial, sans-serif',
      axisColors: ['#ff3653', '#0adb50', '#2c8fdf'],
      axisScale: [0.8, 0.05, 0.05],
      axisHeadScale: 1,
      labels: ['X', 'Y', 'Z'],
      labelColor: '#000',
    });
  }
}
