import {
  coerceNumberProperty,
  createNgtProvider,
  createPassThroughInput,
  createPassThroughOutput,
  NgtInstance,
  NgtThreeEvent,
  NumberInput,
  provideNgtInstance,
} from '@angular-three/core';
import { Directive, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgtSobaGizmoHelper } from '../gizmo-helper';
import { colors, defaultFaces } from './gizmo-viewcube-constants';

@Directive()
export abstract class NgtSobaGizmoViewcubeInputs extends NgtInstance {
  @Input() set font(font: string) {
    this.set({ font });
  }
  get font() {
    return this.get((s) => s['font']);
  }

  @Input() set opacity(opacity: NumberInput) {
    this.set({ opacity: coerceNumberProperty(opacity) });
  }
  get opacity() {
    return this.get((s) => s['opacity']);
  }

  @Input() set color(color: string) {
    this.set({ color });
  }
  get color() {
    return this.get((s) => s['color']);
  }

  @Input() set hoverColor(hoverColor: string) {
    this.set({ hoverColor });
  }
  get hoverColor() {
    return this.get((s) => s['hoverColor']);
  }

  @Input() set textColor(textColor: string) {
    this.set({ textColor });
  }
  get textColor() {
    return this.get((s) => s['textColor']);
  }

  @Input() set strokeColor(strokeColor: string) {
    this.set({ strokeColor });
  }
  get strokeColor() {
    return this.get((s) => s['strokeColor']);
  }

  @Input() set faces(faces: string[]) {
    this.set({ faces });
  }
  get faces() {
    return this.get((s) => s['faces']);
  }

  @Output() click = new EventEmitter<NgtThreeEvent<MouseEvent>>();

  readonly #gizmoHelper = inject(NgtSobaGizmoHelper, { optional: true });

  get gizmoHelper() {
    return this.#gizmoHelper as NgtSobaGizmoHelper;
  }

  get raycast() {
    return this.gizmoHelper.get(
      (s) => s['gizmoRaycast']
    ) as THREE.Object3D['raycast'];
  }

  override preStoreReady(): void {
    if (!this.gizmoHelper) {
      throw new Error(
        `<ngt-soba-gizmo-viewcube> can only be used in <ngt-soba-gizmo-helper>`
      );
    }
  }

  override preInit(): void {
    super.preInit();
    this.set((s) => ({
      skipInit: true,
      skipInitExplicit: true,
      font: s['font'] ?? '20px Inter var, Arial, sans-serif',
      faces: s['faces'] ?? defaultFaces,
      color: s['color'] ?? colors.bg,
      hoverColor: s['hoverColor'] ?? colors.hover,
      textColor: s['textColor'] ?? colors.text,
      strokeColor: s['strokeColor'] ?? colors.stroke,
      opacity: s['opacity'] ?? 1,
    }));
  }

  override initFn(): void | (() => void) | undefined {
    return;
  }
}

export const provideNgtSobaViewCubeInputs = createNgtProvider(
  NgtSobaGizmoViewcubeInputs,
  provideNgtInstance
);

@Directive({
  selector: '[ngtSobaGizmoViewcubeInputsPassThrough]',
  standalone: true,
})
export class NgtSobaGizmoViewcubeInputsPassThrough {
  readonly #host = inject(NgtSobaGizmoViewcubeInputs, {
    optional: true,
    self: true,
  });

  @Input() set ngtSobaGizmoViewcubeInputsPassThrough(wrapper: unknown) {
    if (!this.#host) return;

    this.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.#host);
    const passThroughOutput = createPassThroughOutput(wrapper, this.#host);

    passThroughInput('font', true);
    passThroughInput('opacity', true);
    passThroughInput('color', true);
    passThroughInput('hoverColor', true);
    passThroughInput('textColor', true);
    passThroughInput('strokeColor', true);
    passThroughInput('faces', true);

    passThroughOutput('click');
  }

  private assertWrapper(
    wrapper: unknown
  ): asserts wrapper is NgtSobaGizmoViewcubeInputs {
    if (!(wrapper instanceof NgtSobaGizmoViewcubeInputs)) {
      throw new Error(
        `[NgtSobaGizmoViewcubeInputsPassThrough] wrapper is not an NgtSobaGizmoViewcubeInputs`
      );
    }
  }
}
