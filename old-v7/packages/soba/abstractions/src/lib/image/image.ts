import {
  coerceBoolean,
  coerceNumber,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObjectPassThrough,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtTextureLoader } from '@angular-three/soba/loaders';
import { NgtSobaImageShaderMaterial } from '@angular-three/soba/materials';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'ngt-soba-image[url]',
  standalone: true,
  template: `
    <ngt-mesh shouldPassThroughRef [ngtObjectPassThrough]="this">
      <ngt-plane-geometry
        *ngIf="segments$ | async as segments"
        [args]="[1, 1, segments, segments]"
      ></ngt-plane-geometry>
      <ngt-soba-image-shader-material
        *ngIf="imageShaderMaterialProps$ | async as imageShaderMaterialProps"
        [color]="color!"
        [map]="imageShaderMaterialProps['texture']"
        [zoom]="imageShaderMaterialProps['zoom']"
        [grayscale]="imageShaderMaterialProps['grayscale']"
        [scale]="imageShaderMaterialProps['planeBounds']"
        [imageBounds]="imageShaderMaterialProps['imageBounds']"
        [toneMapped]="imageShaderMaterialProps['toneMapped']"
      ></ngt-soba-image-shader-material>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  imports: [NgtMesh, NgtObjectPassThrough, NgtPlaneGeometry, NgtSobaImageShaderMaterial, NgIf, AsyncPipe],
  providers: [provideNgtObject(NgtSobaImage), provideObjectRef(NgtSobaImage), provideObjectHostRef(NgtSobaImage)],
})
export class NgtSobaImage extends NgtMesh {
  override isWrapper = true;

  @Input() set url(url: string) {
    this.set({ url });
  }

  @Input() set segments(segments: NgtNumberInput) {
    this.set({ segments: coerceNumber(segments) });
  }

  @Input() set zoom(zoom: NgtNumberInput) {
    this.set({ zoom: coerceNumber(zoom) });
  }

  @Input() set grayscale(grayscale: NgtNumberInput) {
    this.set({ grayscale: coerceNumber(grayscale) });
  }

  @Input() set toneMapped(toneMapped: NgtBooleanInput) {
    this.set({ toneMapped: coerceBoolean(toneMapped) });
  }

  private readonly textureLoader = inject(NgtTextureLoader);

  private readonly textureFromUrl$ = this.select((s) => s['url']).pipe(
    switchMap((url: string) => {
      const gl = this.store.getState((s) => s.gl);
      return this.textureLoader.load(url, gl).pipe(
        map((texture) => {
          texture.encoding = gl.outputEncoding;
          return { texture };
        })
      );
    })
  );

  readonly segments$ = this.select((s) => s['segments'], { debounce: true });
  readonly imageShaderMaterialProps$ = this.select(
    this.select((s) => s['texture']),
    this.select((s) => s['zoom']),
    this.select((s) => s.color),
    this.select((s) => s.scale),
    this.select((s) => s['grayscale']),
    this.select((s) => s['toneMapped']),
    (texture, zoom, color, scale, grayscale, toneMapped) => ({
      texture,
      zoom,
      color,
      grayscale,
      toneMapped,
      planeBounds: [scale.x, scale.y],
      imageBounds: [texture.image.width, texture.image.height],
    }),
    { debounce: true }
  );

  override initialize() {
    super.initialize();
    this.set({ segments: 1, zoom: 1, grayscale: 0 });
  }

  override postInit() {
    super.postInit();
    this.set(this.textureFromUrl$);
  }
}
