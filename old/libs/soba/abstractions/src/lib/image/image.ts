import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtObjectPassThrough,
  NgtObjectProps,
  NgtObjectPropsState,
  NgtRenderState,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  Ref,
  startWithUndefined,
} from '@angular-three/core';
import { NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtTextureLoader } from '@angular-three/soba/loaders';
import { NgtSobaImageShaderMaterial } from '@angular-three/soba/shaders';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  inject,
  Input,
  NgModule,
  Output,
  TemplateRef,
} from '@angular/core';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import * as THREE from 'three';

@Directive({
  selector: 'ng-template[ngt-soba-image-content]',
  standalone: true,
})
export class NgtSobaImageContent {
  constructor(public templateRef: TemplateRef<{ image: Ref<THREE.Mesh> }>) {}

  static ngTemplateContextGuard(dir: NgtSobaImageContent, ctx: any): ctx is { image: Ref<THREE.Mesh> } {
    return true;
  }
}

export interface NgtSobaImageState extends NgtObjectPropsState<THREE.Mesh> {
  url: string;
  segments?: number;
  zoom?: number;
  grayscale?: number;
  toneMapped?: boolean;
  texture: THREE.Texture;
}

@Component({
  selector: 'ngt-soba-image[url]',
  standalone: true,
  template: `
    <ng-container *ngIf="imageViewModel$ | async as imageViewModel">
      <ngt-plane-geometry
        noAttach
        #ngtPlane
        [args]="[1, 1, imageViewModel.segments, imageViewModel.segments]"
      ></ngt-plane-geometry>

      <ngt-soba-image-shader-material
        #ngtMaterial
        [color]="color!"
        [map]="imageViewModel.texture"
        [zoom]="imageViewModel.zoom!"
        [grayscale]="imageViewModel.grayscale!"
        [scale]="imageViewModel.planeBounds"
        [imageBounds]="imageViewModel.imageBounds"
        [toneMapped]="imageViewModel.toneMapped!"
      ></ngt-soba-image-shader-material>

      <ngt-mesh
        (beforeRender)="beforeRender.emit($event)"
        [material]="$any(ngtMaterial.instance)"
        [geometry]="$any(ngtPlane.instance)"
        [ngtObjectPassThrough]="this"
      >
        <ng-container
          *ngIf="content"
          [ngTemplateOutlet]="content.templateRef"
          [ngTemplateOutletContext]="{ image: instance }"
        ></ng-container>
      </ngt-mesh>
    </ng-container>
  `,
  imports: [
    NgtMesh,
    NgtObjectPassThrough,
    NgtPlaneGeometry,
    NgtSobaImageShaderMaterial,
    NgIf,
    NgTemplateOutlet,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NgtTextureLoader,
    provideNgtObject(NgtSobaImage),
    provideObjectRef(NgtSobaImage),
    provideObjectHostRef(NgtSobaImage),
  ],
})
export class NgtSobaImage extends NgtObjectProps<THREE.Mesh, NgtSobaImageState> {
  @Output() beforeRender = new EventEmitter<{
    state: NgtRenderState;
    object: THREE.Mesh;
  }>();

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

  @ContentChild(NgtSobaImageContent) content?: NgtSobaImageContent;

  texture$!: Observable<THREE.Texture>;
  imageBounds!: [number, number];
  planeBounds: [number, number] = [1, 1];

  private textureLoader = inject(NgtTextureLoader);

  readonly imageViewModel$ = this.select(
    this.select((s) => s.texture),
    this.select((s) => s.zoom),
    this.select((s) => s.color),
    this.select((s) => s.segments),
    this.select((s) => s.scale),
    this.select((s) => s.grayscale),
    this.select((s) => s.toneMapped).pipe(startWithUndefined()),
    (texture, zoom, color, segments, scale, grayscale, toneMapped) => ({
      texture,
      zoom,
      color,
      segments,
      grayscale,
      toneMapped,
      planeBounds: [scale.x, scale.y],
      imageBounds: [texture.image.width, texture.image.height],
    })
  );

  protected override preInit() {
    this.set((state) => ({
      segments: state.segments ?? 1,
      zoom: state.zoom ?? 1,
      grayscale: state.grayscale ?? 0,
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.setTexture(this.select((s) => s.url));
      });
    });
  }

  private readonly setTexture = this.effect<string>(
    switchMap((url) =>
      this.textureLoader.load(url).pipe(
        tap((texture) => {
          const gl = this.store.get((s) => s.gl);
          texture.encoding = gl.outputEncoding;
          this.set({ texture });
        }),
        catchError(() => EMPTY)
      )
    )
  );
}

@NgModule({
  imports: [NgtSobaImage, NgtSobaImageContent],
  exports: [NgtSobaImage, NgtSobaImageContent],
})
export class NgtSobaImageModule {}
