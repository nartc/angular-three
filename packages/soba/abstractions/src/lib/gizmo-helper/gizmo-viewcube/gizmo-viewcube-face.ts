import { extend, NgtRepeat, NgtThreeEvent } from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input } from '@angular/core';
import { BoxGeometry, CanvasTexture, Mesh, MeshLambertMaterial } from 'three';
import { injectNgtsGizmoHelperApi } from '../gizmo-helper';
import { colors, defaultFaces } from './constants';
import { NgtsGizmoViewcubeInputs } from './gizmo-viewcube-inputs';

extend({ MeshLambertMaterial, Mesh, BoxGeometry });

@Component({
  selector: 'ngts-gizmo-viewcube-face-material[hover][index]',
  standalone: true,
  template: `
    <ngt-mesh-lambert-material
      [attach]="['material', get('index')]"
      [map]="get('texture')"
      [color]="get('hover') ? get('hoverColor') : get('color')"
      [opacity]="get('opacity')"
      transparent
    >
      <ngt-value [rawValue]="store.get('gl').outputEncoding" attach="map.encoding" />
      <ngt-value
        [rawValue]="store.get('gl').capabilities.getMaxAnisotropy() || 1"
        attach="map.anisotrophy"
      />
    </ngt-mesh-lambert-material>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsGizmoViewcubeFaceMaterial extends NgtsGizmoViewcubeInputs {
  readonly #document = inject(DOCUMENT);

  @Input() set index(index: number) {
    this.set({ index });
  }

  @Input() set hover(hover: boolean) {
    this.set({ hover });
  }

  @Input() set font(font: string) {
    this.set({ font: font === undefined ? this.get('font') : font });
  }

  @Input() set color(color: string) {
    this.set({ color: color === undefined ? this.get('color') : color });
  }

  override initialize(): void {
    super.initialize();
    this.set({
      font: '20px Inter var, Arial, sans-serif',
      faces: defaultFaces,
      color: colors.bg,
      hoverColor: colors.hover,
      textColor: colors.text,
      strokeColor: colors.stroke,
      opacity: 1,
    });
    this.connect(
      'texture',
      this.select(
        ['index', 'faces', 'color', 'font', 'textColor', 'strokeColor'],
        ({ index, faces, color, font, textColor, strokeColor }) => {
          const canvas = this.#document.createElement('canvas');
          canvas.width = 128;
          canvas.height = 128;
          const context = canvas.getContext('2d')!;
          context.fillStyle = color;
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.strokeStyle = strokeColor;
          context.strokeRect(0, 0, canvas.width, canvas.height);
          context.font = font;
          context.textAlign = 'center';
          context.fillStyle = textColor;
          context.fillText(faces[index].toUpperCase(), 64, 76);
          return new CanvasTexture(canvas);
        }
      )
    );
  }
}

@Component({
  selector: 'ngts-gizmo-viewcube-face-cube',
  standalone: true,
  template: `
    <ngt-mesh
      (pointermove)="onPointerMove($any($event))"
      (pointerout)="onPointerOut($any($event))"
      (click)="onClick($any($event))"
    >
      <ngt-box-geometry />
      <ngts-gizmo-viewcube-face-material
        *ngFor="let i; repeat: 6"
        [hover]="hover === i"
        [index]="i"
        [font]="get('font')"
        [color]="get('color')"
        [opacity]="get('opacity')"
        [hoverColor]="get('hoverColor')"
        [textColor]="get('textColor')"
        [strokeColor]="get('strokeColor')"
        [faces]="get('faces')"
      />
    </ngt-mesh>
  `,
  imports: [NgtsGizmoViewcubeFaceMaterial, NgtRepeat],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsGizmoViewcubeFaceCube extends NgtsGizmoViewcubeInputs {
  readonly gizmoHelperApi = injectNgtsGizmoHelperApi();

  @Input() set font(font: string) {
    this.set({ font: font === undefined ? this.get('font') : font });
  }

  @Input() set color(color: string) {
    this.set({ color: color === undefined ? this.get('color') : color });
  }

  hover = -1;

  onPointerMove(event: NgtThreeEvent<PointerEvent>) {
    event.stopPropagation();
    this.hover = Math.floor(event.faceIndex! / 2);
  }

  onPointerOut(event: NgtThreeEvent<PointerEvent>) {
    event.stopPropagation();
    this.hover = -1;
  }

  onClick(event: NgtThreeEvent<MouseEvent>) {
    if (this.get('clickEmitter')?.observed) {
      this.get('clickEmitter').emit(event);
    } else {
      event.stopPropagation();
      this.gizmoHelperApi.tweenCamera(event.face!.normal);
    }
  }
}
