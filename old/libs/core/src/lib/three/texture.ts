import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from '../abstracts/instance';
import { tapEffect } from '../stores/component-store';
import type { AnyConstructor, NumberInput } from '../types';
import { checkNeedsUpdate } from '../utils/check-needs-update';
import { coerceNumberProperty } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonTexture<TTexture extends THREE.Texture = THREE.Texture> extends NgtInstance<
  TTexture,
  NgtInstanceState<TTexture>
> {
  abstract get textureType(): AnyConstructor<TTexture>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TTexture>>) {
    this.instanceArgs = v;
  }

  @Input() set image(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) {
    this.set({ image });
  }

  @Input() set mapping(mapping: THREE.Mapping) {
    this.set({ mapping });
  }

  @Input() set wrapS(wrapS: THREE.Wrapping) {
    this.set({ wrapS });
  }

  @Input() set wrapT(wrapT: THREE.Wrapping) {
    this.set({ wrapT });
  }

  @Input() set magFilter(magFilter: THREE.TextureFilter) {
    this.set({ magFilter });
  }

  @Input() set minFilter(minFilter: THREE.TextureFilter) {
    this.set({ minFilter });
  }

  @Input() set format(format: THREE.PixelFormat | THREE.CompressedPixelFormat) {
    this.set({ format });
  }

  @Input() set type(type: THREE.TextureDataType) {
    this.set({ type });
  }

  @Input() set anisotropy(anisotropy: NumberInput) {
    this.set({ anisotropy: coerceNumberProperty(anisotropy) });
  }

  @Input() set encoding(encoding: THREE.TextureEncoding) {
    this.set({ encoding });
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.init(this.ctorParams$);
        this.postInit();
      });
    });
  }

  private readonly init = this.effect(
    tapEffect(() => {
      const gl = this.store.get((s) => s.gl);
      const instanceArgs = this.get((s) => s.instanceArgs);
      const textureInstanceArgs = this.adjustCtorParams(instanceArgs);
      const texture = this.prepareInstance(new this.textureType(...textureInstanceArgs));

      texture.encoding = gl.outputEncoding;
      checkNeedsUpdate(texture);

      return () => {
        texture.dispose();
      };
    })
  );

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      image: true,
      mapping: true,
      wrapS: true,
      wrapT: true,
      magFilter: true,
      minFilter: true,
      format: true,
      type: true,
      anisotropy: true,
      encoding: true,
    };
  }
}

export const provideNgtCommonTexture = createNgtProvider(NgtCommonTexture, provideNgtInstance);
