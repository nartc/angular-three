import { extend, NgtRxStore, NgtThreeEvent } from '@angular-three/core';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { AmbientLight, Group, PointLight } from 'three';
import { injectNgtsGizmoHelperApi } from '../gizmo-helper';
import { NgtsGizmoViewportAxis, NgtsGizmoViewportAxisHead } from './gizmo-viewport-axis';

extend({ Group, AmbientLight, PointLight });

@Component({
  selector: 'ngts-gizmo-viewport',
  standalone: true,
  template: `
    <ngt-group ngtCompound [scale]="40">
      <ngts-gizmo-viewport-axis
        [color]="get('axisColors')[0]"
        [rotation]="[0, 0, 0]"
        [scale]="get('axisScale')"
      ></ngts-gizmo-viewport-axis>
      <ngts-gizmo-viewport-axis
        [color]="get('axisColors')[1]"
        [rotation]="[0, 0, Math.PI / 2]"
        [scale]="get('axisScale')"
      ></ngts-gizmo-viewport-axis>
      <ngts-gizmo-viewport-axis
        [color]="get('axisColors')[2]"
        [rotation]="[0, -Math.PI / 2, 0]"
        [scale]="get('axisScale')"
      ></ngts-gizmo-viewport-axis>
      <ng-container *ngIf="!get('hideAxisHeads')">
        <ngts-gizmo-viewport-axis-head
          [arcStyle]="get('axisColors')[0]"
          [position]="[1, 0, 0]"
          [label]="get('labels')[0]"
          [font]="get('font')"
          [disabled]="get('disabled')"
          [labelColor]="get('labelColor')"
          [clickEmitter]="clicked"
          [axisHeadScale]="get('axisHeadScale')"
          (pointerdown)="onPointerDown($any($event))"
        ></ngts-gizmo-viewport-axis-head>
        <ngts-gizmo-viewport-axis-head
          [arcStyle]="get('axisColors')[1]"
          [position]="[0, 1, 0]"
          [label]="get('labels')[1]"
          [font]="get('font')"
          [disabled]="get('disabled')"
          [labelColor]="get('labelColor')"
          [clickEmitter]="clicked"
          [axisHeadScale]="get('axisHeadScale')"
          (pointerdown)="onPointerDown($any($event))"
        ></ngts-gizmo-viewport-axis-head>
        <ngts-gizmo-viewport-axis-head
          [arcStyle]="get('axisColors')[2]"
          [position]="[0, 0, 1]"
          [label]="get('labels')[2]"
          [font]="get('font')"
          [disabled]="get('disabled')"
          [labelColor]="get('labelColor')"
          [clickEmitter]="clicked"
          [axisHeadScale]="get('axisHeadScale')"
          (pointerdown)="onPointerDown($any($event))"
        ></ngts-gizmo-viewport-axis-head>
        <ng-container *ngIf="!get('hideNegativeAxes')">
          <ngts-gizmo-viewport-axis-head
            [arcStyle]="get('axisColors')[0]"
            [position]="[-1, 0, 0]"
            [font]="get('font')"
            [disabled]="get('disabled')"
            [labelColor]="get('labelColor')"
            [clickEmitter]="clicked"
            [axisHeadScale]="get('axisHeadScale')"
            (pointerdown)="onPointerDown($any($event))"
          ></ngts-gizmo-viewport-axis-head>
          <ngts-gizmo-viewport-axis-head
            [arcStyle]="get('axisColors')[1]"
            [position]="[0, -1, 0]"
            [font]="get('font')"
            [disabled]="get('disabled')"
            [labelColor]="get('labelColor')"
            [clickEmitter]="clicked"
            [axisHeadScale]="get('axisHeadScale')"
            (pointerdown)="onPointerDown($any($event))"
          ></ngts-gizmo-viewport-axis-head>
          <ngts-gizmo-viewport-axis-head
            [arcStyle]="get('axisColors')[2]"
            [position]="[0, 0, -1]"
            [font]="get('font')"
            [disabled]="get('disabled')"
            [labelColor]="get('labelColor')"
            [clickEmitter]="clicked"
            [axisHeadScale]="get('axisHeadScale')"
            (pointerdown)="onPointerDown($any($event))"
          ></ngts-gizmo-viewport-axis-head>
        </ng-container>
      </ng-container>
      <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
      <ngt-point-light position="10" intensity="0.5"></ngt-point-light>
    </ngt-group>
  `,
  imports: [NgtsGizmoViewportAxis, NgtsGizmoViewportAxisHead, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsGizmoViewport extends NgtRxStore {
  readonly gizmoHelperApi = injectNgtsGizmoHelperApi();

  readonly Math = Math;

  @Input() set axisColors(axisColors: [string, string, string]) {
    this.set({ axisColors });
  }

  @Input() set axisScale(axisScale: [number, number, number]) {
    this.set({ axisScale });
  }

  @Input() set labels(labels: [string, string, string]) {
    this.set({ labels });
  }

  @Input() set axisHeadScale(axisHeadScale: number) {
    this.set({ axisHeadScale });
  }

  @Input() set labelColor(labelColor: string) {
    this.set({ labelColor });
  }

  @Input() set hideNegativeAxes(hideNegativeAxes: boolean) {
    this.set({ hideNegativeAxes });
  }

  @Input() set hideAxisHeads(hideAxisHeads: boolean) {
    this.set({ hideAxisHeads });
  }

  @Input() set disabled(disabled: boolean) {
    this.set({ disabled });
  }

  @Input() set font(font: string) {
    this.set({ font });
  }

  @Output() clicked = new EventEmitter<NgtThreeEvent<MouseEvent>>();

  override initialize(): void {
    super.initialize();
    this.set({
      font: '18px Inter var, Arial, sans-serif',
      axisColors: ['#ff2060', '#20df80', '#2080ff'],
      axisHeadScale: 1,
      labels: ['X', 'Y', 'Z'],
      labelColor: '#000',
    });
  }

  onPointerDown(event: NgtThreeEvent<PointerEvent>) {
    if (!this.get('disabled')) {
      event.stopPropagation();
      this.gizmoHelperApi.tweenCamera(event.object.position);
    }
  }
}
