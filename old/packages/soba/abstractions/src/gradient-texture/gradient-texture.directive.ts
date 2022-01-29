import { EnhancedRxState, NgtMaterial, Tail } from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  Inject,
  Input,
  NgModule,
  NgZone,
  Optional,
  Output,
} from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
import { selectSlice } from '@rx-angular/state';
import * as THREE from 'three';

interface NgtSobaGradientTextureState {
  stops: Array<number>;
  colors: Array<string>;
  args: Tail<ConstructorParameters<typeof THREE.Texture>>;
  texture: THREE.Texture;
  size: number;
}

@Directive({
  selector: 'ngt-soba-gradient-texture[stops][colors]',
  exportAs: 'ngtSobaGradientTexture',
})
export class NgtSobaGradientTexture extends EnhancedRxState<NgtSobaGradientTextureState> {
  @Input() set stops(stops: Array<number>) {
    this.set({ stops });
  }

  @Input() set colors(colors: Array<string>) {
    this.set({ colors });
  }

  @Input() set size(size: number) {
    this.set({ size });
  }

  @Input() set args(args: Tail<ConstructorParameters<typeof THREE.Texture>>) {
    this.set({ args });
  }

  @Output() ready = this.select('texture');

  get texture() {
    return this.get('texture');
  }

  constructor(
    ngZone: NgZone,
    @Inject(DOCUMENT) document: Document,
    @Optional() material: NgtMaterial
  ) {
    super();

    this.set({ size: 2048, args: [] });

    requestAnimationFrame(() => {
      this.connect(
        'texture',
        this.select(selectSlice(['stops', 'args'])),
        (_, { stops, args }) => {
          const { colors, size } = this.get();
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.width = 16;
          canvas.height = size;
          const gradient = context.createLinearGradient(0, 0, 0, size);
          let i = stops.length;
          while (i--) {
            gradient.addColorStop(stops[i], colors[i]);
          }
          context.fillStyle = gradient;
          context.fillRect(0, 0, 16, size);
          const texture = new THREE.Texture(canvas, ...args);
          texture.needsUpdate = true;
          return texture;
        }
      );

      this.holdEffect(this.select('texture'), (texture) => {
        if (material) {
          Object.assign(material.material, { map: texture });
        }

        return () => {
          texture.dispose();
        };
      });
    });
  }
}

@NgModule({
  declarations: [NgtSobaGradientTexture],
  exports: [NgtSobaGradientTexture],
})
export class NgtSobaGradientTextureModule {}
