import {
  AnyConstructor,
  coerceNumberProperty,
  NgtCommonTexture,
  NumberInput,
  provideCommonTextureRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-gradient-texture[stops][colors]',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonTextureRef(NgtSobaGradientTexture)],
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

  override get textureType(): AnyConstructor<THREE.Texture> {
    return THREE.Texture;
  }

  protected override adjustCtorParams(instanceArgs: unknown[]): unknown[] {
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

  protected override get ctorParams$() {
    return this.select(
      this.select((s) => s['stops']),
      this.select((s) => s['colors']),
      this.instanceArgs$
    );
  }

  protected override preInit() {
    this.set((state) => ({
      size: state['size'] || 1024,
      attach: state.attach.length ? state.attach : ['map'],
    }));
  }
}

@NgModule({
  imports: [NgtSobaGradientTexture],
  exports: [NgtSobaGradientTexture],
})
export class NgtSobaGradientTextureModule {}
