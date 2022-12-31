import { injectNgtStore, NgtRxStore } from '@angular-three/core';
import { Directive, ElementRef, Input } from '@angular/core';
import { Loader, Scene, Texture, TextureEncoding } from 'three';
import { NgtsEnvironmentPresetsType } from './assets';

@Directive()
export abstract class NgtsEnvironmentInputs extends NgtRxStore {
  protected readonly store = injectNgtStore();

  @Input() set frames(frames: number) {
    this.set({ frames });
  }

  @Input() set near(near: number) {
    this.set({ near });
  }

  @Input() set far(far: number) {
    this.set({ far });
  }

  @Input() set resolution(resolution: number) {
    this.set({ resolution });
  }

  @Input() set background(background: boolean | 'only') {
    this.set({ background });
  }

  @Input() set blur(blur: number) {
    this.set({ blur });
  }

  @Input() set map(map: Texture) {
    this.set({ map });
  }

  @Input() set files(files: string | string[]) {
    this.set({ files });
  }

  @Input() set path(path: string) {
    this.set({ path });
  }

  @Input() set preset(preset: NgtsEnvironmentPresetsType) {
    this.set({ preset });
  }

  @Input() set scene(scene: Scene | ElementRef<Scene>) {
    this.set({ scene });
  }

  @Input() set extensions(extensions: (loader: Loader) => void) {
    this.set({ extensions });
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
    this.set({ ground });
  }

  @Input() set encoding(encoding: TextureEncoding) {
    this.set({ encoding });
  }
}
