import {
  coerceBoolean,
  coerceNumber,
  createNgtProvider,
  createPassThroughInput,
  is,
  NgtBooleanInput,
  NgtInstance,
  NgtNumberInput,
  NgtRef,
  provideNgtInstance,
} from '@angular-three/core';
import { Directive, inject, Input } from '@angular/core';
import { map } from 'rxjs';
import * as THREE from 'three';
import type { PresetsType } from './presets';

@Directive()
export abstract class NgtSobaEnvironmentInputs extends NgtInstance {
  @Input() set frames(frames: NgtNumberInput) {
    this.set({ frames: coerceNumber(frames), framesExplicit: true });
  }
  get frames() {
    return this.getState((s) => s['frames']);
  }

  @Input() set near(near: NgtNumberInput) {
    this.set({ near: coerceNumber(near), nearExplicit: true });
  }
  get near(): number {
    return this.getState((s) => s['near']);
  }

  @Input() set far(far: NgtNumberInput) {
    this.set({ far: coerceNumber(far), farExplicit: true });
  }
  get far(): number {
    return this.getState((s) => s['far']);
  }

  @Input() set resolution(resolution: NgtNumberInput) {
    this.set({
      resolution: coerceNumber(resolution),
      resolutionExplicit: true,
    });
  }
  get resolution() {
    return this.getState((s) => s['resolution']);
  }

  @Input() set background(background: NgtBooleanInput | 'only') {
    this.set({
      background: background === 'only' ? background : coerceBoolean(background),
      backgroundExplicit: true,
    });
  }
  get background() {
    return this.getState((s) => s['background']);
  }

  @Input() set map(map: THREE.Texture) {
    this.set({ map, mapExplicit: true });
  }
  get map() {
    return this.getState((s) => s['map']) as THREE.Texture;
  }

  @Input() set files(files: string | string[]) {
    this.set({ files, filesExplicit: true });
  }
  get files() {
    return this.getState((s) => s['files']) as string | string[];
  }

  @Input() set path(path: string) {
    this.set({ path, pathExplicit: true });
  }
  get path() {
    return this.getState((s) => s['path']) as string;
  }

  @Input() set preset(preset: PresetsType) {
    this.set({ preset, presetExplicit: true });
  }
  get preset() {
    return this.getState((s) => s['preset']) as PresetsType;
  }

  @Input() set scene(scene: THREE.Scene | NgtRef<THREE.Scene>) {
    this.set({ scene, sceneExplicit: true });
  }
  get scene() {
    return this.getState((s) => s['scene']) as THREE.Scene | NgtRef<THREE.Scene>;
  }

  @Input() set extensions(extensions: (loader: THREE.Loader) => void) {
    this.set({ extensions, extensionsExplicit: true });
  }
  get extensions() {
    return this.getState((s) => s['extensions']) as (loader: THREE.Loader) => void;
  }

  @Input() set ground(
    ground:
      | NgtBooleanInput
      | {
          radius?: number;
          height?: number;
          scale?: number;
        }
  ) {
    this.set({
      ground: is.obj(ground) ? ground : coerceBoolean(ground),
      groundExplicit: true,
    });
  }
  get ground() {
    return this.getState((s) => s['ground']);
  }

  @Input() set blur(blur: NgtNumberInput) {
    this.set({ blur: coerceNumber(blur), blurExplicit: true });
  }
  get blur() {
    return this.getState((s) => s['blur']);
  }

  @Input() set encoding(encoding: THREE.TextureEncoding) {
    this.set({ encoding, encodingExplicit: true });
  }
  get encoding() {
    return this.getState((s) => s['encoding']);
  }

  override initFn(): void | (() => void) | undefined {
    return;
  }

  override initialize() {
    super.initialize();
    this.set({ background: false });
  }

  getEnvironmentResolverParams$(defaultParams: NgtSobaEnvironmentResolverParams) {
    return this.select(
      this.select((s) => s['files']).pipe(map((files) => files || defaultParams.files)),
      this.select((s) => s['path']).pipe(map((path) => path || defaultParams.path)),
      this.select((s) => s['preset']),
      this.select((s) => s['encoding']),
      this.select((s) => s['extensions']),
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

export const provideNgtSobaEnvironmentInputs = createNgtProvider(NgtSobaEnvironmentInputs, provideNgtInstance);

export type NgtSobaEnvironmentResolverParams = Partial<
  Pick<NgtSobaEnvironmentInputs, 'files' | 'path' | 'preset' | 'extensions' | 'encoding'>
>;

@Directive({
  selector: '[ngtSobaEnvironmentInputsPassThrough]',
  standalone: true,
})
export class NgtSobaEnvironmentInputsPassThrough {
  private readonly host = inject(NgtSobaEnvironmentInputs, {
    optional: true,
    self: true,
  });

  @Input() set ngtSobaEnvironmentInputsPassThrough(wrapper: unknown) {
    if (!this.host) return;

    NgtSobaEnvironmentInputsPassThrough.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.host);

    passThroughInput('frames');
    passThroughInput('near');
    passThroughInput('far');
    passThroughInput('resolution');
    passThroughInput('background');
    passThroughInput('map');
    passThroughInput('files');
    passThroughInput('path');
    passThroughInput('preset');
    passThroughInput('scene');
    passThroughInput('extensions');
    passThroughInput('ground');
    passThroughInput('blur');
    passThroughInput('encoding');
  }

  private static assertWrapper(wrapper: unknown): asserts wrapper is NgtSobaEnvironmentInputs {
    if (!(wrapper instanceof NgtSobaEnvironmentInputs)) {
      throw new Error(`[ngtSobaEnvironmentInputsPassThrough] wrapper is not an NgtSobaEnvironmentInputs`);
    }
  }
}
