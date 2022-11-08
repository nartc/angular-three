import {
  AnyConstructor,
  coerceNumberProperty,
  NgtCommonTexture,
  NumberInput,
  provideCommonTextureRef,
  provideNgtCommonTexture,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-gradient-texture[stops][colors]',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonTexture(NgtSobaGradientTexture),
    provideCommonTextureRef(NgtSobaGradientTexture),
  ],
})
export class NgtSobaGradientTexture extends NgtCommonTexture {
  @Input() set stops(stops: Array<number>) {
    this.set({ stops });
  }

  @Input() set colors(colors: Array<string>) {
    this.set({ colors });
  }

  @Input() set size(size: NumberInput) {
    this.set({ size: coerceNumberProperty(size) });
  }

  get textureType(): AnyConstructor<THREE.Texture> {
    return THREE.Texture;
  }

  override initTrigger$ = this.select(
    this.select((s) => s['stops']),
    this.select((s) => s['colors']),
    this.instanceArgs$
  );

  override initInstanceArgs(instanceArgs: unknown[]): unknown[] {
    const { stops, colors, size } = this.get();
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

  override preInit() {
    super.preInit();
    this.set((s) => ({
      size: s['size'] || 1024,
      attach: s.attach.length ? s.attach : ['map'],
    }));
  }
}
