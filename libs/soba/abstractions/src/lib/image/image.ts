import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtObjectPassThrough,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  startWithUndefined,
} from '@angular-three/core';
import { NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtTextureLoader } from '@angular-three/soba/loaders';
import { NgtSobaImageShaderMaterial } from '@angular-three/soba/materials';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'ngt-soba-image[url]',
  standalone: true,
  template: `
    <ngt-mesh [ngtObjectPassThrough]="this">
      <ngt-plane-geometry
        *ngIf="segments$ | async as segments"
        [args]="[1, 1, segments, segments]"
      ></ngt-plane-geometry>
      <ngt-soba-image-shader-material
        *ngIf="imageShaderMaterialProps$ | async as imageShaderMaterialProps"
        [color]="color"
        [map]="imageShaderMaterialProps.texture"
        [zoom]="imageShaderMaterialProps.zoom"
        [grayscale]="imageShaderMaterialProps.grayscale"
        [scale]="imageShaderMaterialProps.planeBounds"
        [imageBounds]="imageShaderMaterialProps.imageBounds"
        [toneMapped]="imageShaderMaterialProps.toneMapped"
      ></ngt-soba-image-shader-material>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtMesh,
    NgtObjectPassThrough,
    NgtPlaneGeometry,
    NgIf,
    AsyncPipe,
    NgtSobaImageShaderMaterial,
  ],
  providers: [
    provideNgtObject(NgtSobaImage),
    provideObjectRef(NgtSobaImage),
    provideObjectHostRef(NgtSobaImage),
  ],
})
export class NgtSobaImage extends NgtMesh {
  override isWrapper = true;
  override shouldPassThroughRef = true;

  @Input() set url(url: string) {
    this.set({ url });
  }

  @Input() set segments(segments: NumberInput) {
    this.set({ segments: coerceNumberProperty(segments) });
  }

  @Input() set zoom(zoom: NumberInput) {
    this.set({ zoom: coerceNumberProperty(zoom) });
  }

  @Input() set grayscale(grayscale: NumberInput) {
    this.set({ grayscale: coerceNumberProperty(grayscale) });
  }

  @Input() set toneMapped(toneMapped: BooleanInput) {
    this.set({ toneMapped: coerceBooleanProperty(toneMapped) });
  }

  readonly #textureLoader = inject(NgtTextureLoader);

  readonly #textureFromUrl$ = this.select((s) => s['url']).pipe(
    switchMap((url: string) => {
      const gl = this.store.get((s) => s.gl);
      return this.#textureLoader.load(url, gl).pipe(
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
    this.select((s) => s['toneMapped']).pipe(startWithUndefined()),
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

  override preInit() {
    super.preInit();
    this.set((s) => ({
      segments: s['segments'] ?? 1,
      zoom: s['zoom'] ?? 1,
      grayscale: s['grayscale'] ?? 0,
    }));
  }

  override postInit() {
    super.postInit();
    this.set(this.#textureFromUrl$);
  }
}
