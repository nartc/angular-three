import {
  coerceNumber,
  createNgtProvider,
  createPassThroughInput,
  createPassThroughOutput,
  NgtInstance,
  NgtNumberInput,
  NgtThreeEvent,
  provideNgtInstance,
} from '@angular-three/core';
import { Directive, EventEmitter, inject, Input, Output } from '@angular/core';
import * as THREE from 'three';
import { NgtSobaGizmoHelper } from '../gizmo-helper';
import { colors, defaultFaces } from './gizmo-viewcube-constants';

@Directive()
export abstract class NgtSobaGizmoViewcubeInputs extends NgtInstance {
  @Input() set font(font: string) {
    this.set({ font });
  }
  get font() {
    return this.getState((s) => s['font']);
  }

  @Input() set opacity(opacity: NgtNumberInput) {
    this.set({ opacity: coerceNumber(opacity) });
  }
  get opacity() {
    return this.getState((s) => s['opacity']);
  }

  @Input() set color(color: string) {
    this.set({ color });
  }
  get color() {
    return this.getState((s) => s['color']);
  }

  @Input() set hoverColor(hoverColor: string) {
    this.set({ hoverColor });
  }
  get hoverColor() {
    return this.getState((s) => s['hoverColor']);
  }

  @Input() set textColor(textColor: string) {
    this.set({ textColor });
  }
  get textColor() {
    return this.getState((s) => s['textColor']);
  }

  @Input() set strokeColor(strokeColor: string) {
    this.set({ strokeColor });
  }
  get strokeColor() {
    return this.getState((s) => s['strokeColor']);
  }

  @Input() set faces(faces: string[]) {
    this.set({ faces });
  }
  get faces() {
    return this.getState((s) => s['faces']);
  }

  @Output() viewcubeClick = new EventEmitter<NgtThreeEvent<MouseEvent>>();

  private readonly _gizmoHelper = inject(NgtSobaGizmoHelper, {
    optional: true,
  });

  get gizmoHelper() {
    return this._gizmoHelper as NgtSobaGizmoHelper;
  }

  get raycast() {
    return this.gizmoHelper.getState((s) => s['gizmoRaycast']) as THREE.Object3D['raycast'];
  }

  override preStoreReady(): void {
    if (!this.gizmoHelper) {
      throw new Error(`<ngt-soba-gizmo-viewcube> can only be used in <ngt-soba-gizmo-helper>`);
    }
  }

  override initialize(): void {
    super.initialize();
    this.set({
      skipInit: true,
      skipInitExplicit: true,
      font: '20px Inter var, Arial, sans-serif',
      faces: defaultFaces,
      color: colors.bg,
      hoverColor: colors.hover,
      textColor: colors.text,
      strokeColor: colors.stroke,
      opacity: 1,
    });
  }

  override initFn(): void | (() => void) | undefined {
    return;
  }
}

export const provideNgtSobaViewCubeInputs = createNgtProvider(NgtSobaGizmoViewcubeInputs, provideNgtInstance);

@Directive({
  selector: '[ngtSobaGizmoViewcubeInputsPassThrough]',
  standalone: true,
})
export class NgtSobaGizmoViewcubeInputsPassThrough {
  private readonly host = inject(NgtSobaGizmoViewcubeInputs, {
    optional: true,
    self: true,
  });

  @Input() set ngtSobaGizmoViewcubeInputsPassThrough(wrapper: unknown) {
    if (!this.host) return;

    this.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.host);
    const passThroughOutput = createPassThroughOutput(wrapper, this.host);

    passThroughInput('font');
    passThroughInput('opacity');
    passThroughInput('color');
    passThroughInput('hoverColor');
    passThroughInput('textColor');
    passThroughInput('strokeColor');
    passThroughInput('faces');

    passThroughOutput('viewcubeClick');
  }

  private assertWrapper(wrapper: unknown): asserts wrapper is NgtSobaGizmoViewcubeInputs {
    if (!(wrapper instanceof NgtSobaGizmoViewcubeInputs)) {
      throw new Error(`[NgtSobaGizmoViewcubeInputsPassThrough] wrapper is not an NgtSobaGizmoViewcubeInputs`);
    }
  }
}
