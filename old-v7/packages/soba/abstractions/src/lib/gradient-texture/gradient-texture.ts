import {
  coerceNumber,
  NgtAnyConstructor,
  NgtCommonTexture,
  NgtNumberInput,
  provideCommonTextureRef,
  provideNgtCommonTexture,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-gradient-texture[stops][colors]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonTexture(NgtSobaGradientTexture), provideCommonTextureRef(NgtSobaGradientTexture)],
})
export class NgtSobaGradientTexture extends NgtCommonTexture {
  @Input() set stops(stops: Array<number>) {
    this.set({ stops });
  }

  @Input() set colors(colors: Array<string>) {
    this.set({ colors });
  }

  @Input() set size(size: NgtNumberInput) {
    this.set({ size: coerceNumber(size) });
  }

  get textureType(): NgtAnyConstructor<THREE.Texture> {
    return THREE.Texture;
  }

  override initTrigger$ = this.select(
    this.select((s) => s['stops']),
    this.select((s) => s['colors']),
    this.instanceArgs$,
    this.defaultProjector
  );

  override initInstanceArgs(instanceArgs: unknown[]): unknown[] {
    const { stops, colors, size } = this.getState();
    const canvas = this.document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 16;
    canvas.height = size;
    const gradient = context.createLinearGradient(0, 0, 0, size);
    let i = Math.min(stops.length, colors.length);
    while (i--) {
      gradient.addColorStop(stops[i], colors[i]);
    }
    context.fillStyle = gradient;
    context.fillRect(0, 0, 16, size);

    return [canvas, ...instanceArgs];
  }

  override initialize() {
    super.initialize();
    this.set({ size: 1024, attach: ['map'] });
  }
}
