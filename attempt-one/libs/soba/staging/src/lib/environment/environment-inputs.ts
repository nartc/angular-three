import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  createNgtProvider,
  createPassThroughInput,
  is,
  NgtInstance,
  NgtRef,
  NumberInput,
  provideNgtInstance,
  startWithUndefined,
} from '@angular-three/core';
import { Directive, inject, Input } from '@angular/core';
import { startWith } from 'rxjs';
import * as THREE from 'three';
import type { PresetsType } from './presets';

@Directive()
export abstract class NgtSobaEnvironmentInputs extends NgtInstance {
  @Input() set frames(frames: NumberInput) {
    this.set({ frames: coerceNumberProperty(frames) });
  }
  get frames() {
    return this.get((s) => s['frames']);
  }

  @Input() set near(near: NumberInput) {
    this.set({ near: coerceNumberProperty(near) });
  }
  get near() {
    return this.get((s) => s['near']);
  }

  @Input() set far(far: NumberInput) {
    this.set({ far: coerceNumberProperty(far) });
  }
  get far() {
    return this.get((s) => s['far']);
  }

  @Input() set resolution(resolution: NumberInput) {
    this.set({ resolution: coerceNumberProperty(resolution) });
  }
  get resolution() {
    return this.get((s) => s['resolution']);
  }

  @Input() set background(background: BooleanInput | 'only') {
    this.set({
      background:
        background === 'only' ? background : coerceBooleanProperty(background),
    });
  }
  get background() {
    return this.get((s) => s['background']);
  }

  @Input() set map(map: THREE.Texture) {
    this.set({ map });
  }
  get map() {
    return this.get((s) => s['map']) as THREE.Texture;
  }

  @Input() set files(files: string | string[]) {
    this.set({ files });
  }
  get files() {
    return this.get((s) => s['files']) as string | string[];
  }

  @Input() set path(path: string) {
    this.set({ path });
  }
  get path() {
    return this.get((s) => s['path']) as string;
  }

  @Input() set preset(preset: PresetsType) {
    this.set({ preset });
  }
  get preset() {
    return this.get((s) => s['preset']) as PresetsType;
  }

  @Input() set scene(scene: THREE.Scene | NgtRef<THREE.Scene>) {
    this.set({ scene });
  }
  get scene() {
    return this.get((s) => s['scene']) as THREE.Scene | NgtRef<THREE.Scene>;
  }

  @Input() set extensions(extensions: (loader: THREE.Loader) => void) {
    this.set({ extensions });
  }
  get extensions() {
    return this.get((s) => s['extensions']) as (loader: THREE.Loader) => void;
  }

  @Input() set ground(
    ground:
      | BooleanInput
      | {
          radius?: number;
          height?: number;
          scale?: number;
        }
  ) {
    this.set({
      ground: is.obj(ground) ? ground : coerceBooleanProperty(ground),
    });
  }
  get ground() {
    return this.get((s) => s['ground']);
  }

  @Input() set blur(blur: NumberInput) {
    this.set({ blur: coerceNumberProperty(blur) });
  }
  get blur() {
    return this.get((s) => s['blur']);
  }

  @Input() set encoding(encoding: THREE.TextureEncoding) {
    this.set({ encoding });
  }
  get encoding() {
    return this.get((s) => s['encoding']);
  }

  override initFn(): void | (() => void) | undefined {
    return;
  }

  override preInit() {
    super.preInit();
    this.set((state) => ({
      background: state['background'] ?? false,
    }));
  }

  getEnvironmentResolverParams$(
    defaultParams: NgtSobaEnvironmentResolverParams
  ) {
    return this.select(
      this.select((s) => s['files']).pipe(startWith(defaultParams.files)),
      this.select((s) => s['path']).pipe(startWith(defaultParams.path)),
      this.select((s) => s['preset']).pipe(startWithUndefined()),
      this.select((s) => s['encoding']).pipe(startWithUndefined()),
      this.select((s) => s['extensions']).pipe(startWithUndefined()),
      (files, path, preset, encoding, extensions) => ({
        files,
        path,
        preset,
        encoding,
        extensions,
      })
    );
  }
}

export const provideNgtSobaEnvironmentInputs = createNgtProvider(
  NgtSobaEnvironmentInputs,
  provideNgtInstance
);

export type NgtSobaEnvironmentResolverParams = Partial<
  Pick<
    NgtSobaEnvironmentInputs,
    'files' | 'path' | 'preset' | 'extensions' | 'encoding'
  >
>;

@Directive({
  selector: '[ngtSobaEnvironmentInputsPassThrough]',
  standalone: true,
})
export class NgtSobaEnvironmentInputsPassThrough {
  readonly #host = inject(NgtSobaEnvironmentInputs, {
    optional: true,
    self: true,
  });

  @Input() set ngtSobaEnvironmentInputsPassThrough(wrapper: unknown) {
    if (!this.#host) return;

    NgtSobaEnvironmentInputsPassThrough.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.#host);

    passThroughInput('frames', true);
    passThroughInput('near', true);
    passThroughInput('far', true);
    passThroughInput('resolution', true);
    passThroughInput('background', true);
    passThroughInput('map', true);
    passThroughInput('files', true);
    passThroughInput('path', true);
    passThroughInput('preset', true);
    passThroughInput('scene', true);
    passThroughInput('extensions', true);
    passThroughInput('ground', true);
    passThroughInput('blur', true);
    passThroughInput('encoding', true);
  }

  private static assertWrapper(
    wrapper: unknown
  ): asserts wrapper is NgtSobaEnvironmentInputs {
    if (!(wrapper instanceof NgtSobaEnvironmentInputs)) {
      throw new Error(
        `[ngtSobaEnvironmentInputsPassThrough] wrapper is not an NgtSobaEnvironmentInputs`
      );
    }
  }
}
