import { Directive, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from '../abstracts/instance';
import type { NgtAnyConstructor, NgtNumberInput, NgtObservableInput, NgtPrepareInstanceFn } from '../types';
import { checkNeedsUpdate } from '../utils/check-update';
import { coerceNumber } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonTexture<TTexture extends THREE.Texture = THREE.Texture> extends NgtInstance<
  TTexture,
  NgtInstanceState<TTexture>
> {
  abstract get textureType(): NgtAnyConstructor<TTexture>;

  @Input() set args(v: ConstructorParameters<NgtAnyConstructor<TTexture>>) {
    this.instanceArgs = v;
  }

  @Input() set image(image: NgtObservableInput<HTMLImageElement | HTMLCanvasElement | HTMLVideoElement>) {
    this.set({ image });
  }

  @Input() set mapping(mapping: NgtObservableInput<THREE.Mapping>) {
    this.set({ mapping });
  }

  @Input() set wrapS(wrapS: NgtObservableInput<THREE.Wrapping>) {
    this.set({ wrapS });
  }

  @Input() set wrapT(wrapT: NgtObservableInput<THREE.Wrapping>) {
    this.set({ wrapT });
  }

  @Input() set magFilter(magFilter: NgtObservableInput<THREE.TextureFilter>) {
    this.set({ magFilter });
  }

  @Input() set minFilter(minFilter: NgtObservableInput<THREE.TextureFilter>) {
    this.set({ minFilter });
  }

  @Input() set format(format: NgtObservableInput<THREE.PixelFormat | THREE.CompressedPixelFormat>) {
    this.set({ format });
  }

  @Input() set type(type: NgtObservableInput<THREE.TextureDataType>) {
    this.set({ type });
  }

  @Input() set anisotropy(anisotropy: NgtObservableInput<NgtNumberInput>) {
    this.set({
      anisotropy: isObservable(anisotropy) ? anisotropy.pipe(map(coerceNumber)) : coerceNumber(anisotropy),
    });
  }

  @Input() set encoding(encoding: NgtObservableInput<THREE.TextureEncoding>) {
    this.set({ encoding });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<TTexture>): (() => void) | void | undefined {
    const texture = prepareInstance(new this.textureType(...this.initInstanceArgs(this.instanceArgs)));

    texture.encoding = this.store.getState((s) => s.gl.outputEncoding);
    checkNeedsUpdate(texture);

    return () => {
      texture.dispose();
    };
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'image',
      'mapping',
      'wrapS',
      'wrapT',
      'magFilter',
      'minFilter',
      'format',
      'type',
      'anisotropy',
      'encoding',
    ];
  }
}

export const provideNgtCommonTexture = createNgtProvider(NgtCommonTexture, provideNgtInstance);
