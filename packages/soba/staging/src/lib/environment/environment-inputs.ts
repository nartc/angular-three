import { injectNgtStore, NgtRxStore } from '@angular-three/core';
import { Directive, ElementRef, Input } from '@angular/core';
import { Loader, Scene, Texture, TextureEncoding } from 'three';
import { NgtsEnvironmentPresetsType } from './assets';

@Directive()
export abstract class NgtsEnvironmentInputs extends NgtRxStore {
  protected readonly store = injectNgtStore();

  @Input() set frames(frames: number) {
    this.set({ frames: frames === undefined ? this.get('frames') : frames });
  }

  @Input() set near(near: number) {
    this.set({ near: near === undefined ? this.get('near') : near });
  }

  @Input() set far(far: number) {
    this.set({ far: far === undefined ? this.get('far') : far });
  }

  @Input() set resolution(resolution: number) {
    this.set({ resolution: resolution === undefined ? this.get('resolution') : resolution });
  }

  @Input() set background(background: boolean | 'only') {
    this.set({ background: background === undefined ? this.get('background') : background });
  }

  @Input() set blur(blur: number) {
    this.set({ blur: blur === undefined ? this.get('blur') : blur });
  }

  @Input() set map(map: Texture) {
    this.set({ map: map === undefined ? this.get('map') : map });
  }

  @Input() set files(files: string | string[]) {
    this.set({ files: files === undefined ? this.get('files') : files });
  }

  @Input() set path(path: string) {
    this.set({ path: path === undefined ? this.get('path') : path });
  }

  @Input() set preset(preset: NgtsEnvironmentPresetsType) {
    this.set({ preset: preset === undefined ? this.get('preset') : preset });
  }

  @Input() set scene(scene: Scene | ElementRef<Scene>) {
    this.set({ scene: scene === undefined ? this.get('scene') : scene });
  }

  @Input() set extensions(extensions: (loader: Loader) => void) {
    this.set({ extensions: extensions === undefined ? this.get('extensions') : extensions });
  }

  @Input() set ground(
    ground:
      | boolean
      | {
          radius?: number;
          height?: number;
          scale?: number;
        }
  ) {
    this.set({ ground: ground === undefined ? this.get('ground') : ground });
  }

  @Input() set encoding(encoding: TextureEncoding) {
    this.set({ encoding: encoding === undefined ? this.get('encoding') : encoding });
  }
}
