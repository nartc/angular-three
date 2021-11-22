import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtAnimationReady,
  NgtColor,
  NgtCoreModule,
  NgtObject3dController,
} from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { TextureLoaderService } from '@angular-three/soba/loaders';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtImageShaderMaterial } from './image-shader-material.directive';

@Component({
  selector: 'ngt-image[url]',
  exportAs: 'ngtImage',
  template: `
    <ng-container *ngIf="texture$ | async as texture">
      <ngt-mesh
        [scale]="scale"
        [controller]="object3dController"
        (ready)="ready.emit([this, $event])"
        (animateReady)="
          animateReady.emit({
            renderState: $event.renderState,
            animateObject: [this, $event.animateObject]
          })
        "
      >
        <ngt-plane-geometry
          [args]="[1, 1, segments, segments]"
        ></ngt-plane-geometry>
        <ngt-image-shader-material
          [parameters]="{color, map: texture, zoom, grayscale, scale: planeBounds, imageBounds}"
        ></ngt-image-shader-material>
        <ng-content></ng-content>
      </ngt-mesh>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER],
})
export class NgtImage implements OnChanges {
  @Input() segments?: number;
  @Input() scale?: number;
  @Input() color?: NgtColor;
  @Input() zoom?: number;
  @Input() grayscale?: number;

  @Input() set url(v: string) {
    this.texture$ = this.textureLoaderService.load(v).pipe(
      tap((texture) => {
        this.imageBounds = [texture.image.width, texture.image.height];
      })
    );
  }

  @Output() ready = new EventEmitter<[NgtImage, THREE.Mesh]>();
  @Output() animateReady = new EventEmitter<
    NgtAnimationReady<[NgtImage, THREE.Mesh]>
  >();

  planeBounds?: [number, number];
  imageBounds?: [number, number];

  texture$?: Observable<THREE.Texture>;

  constructor(
    private textureLoaderService: TextureLoaderService,
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.planeBounds = Array.isArray(this.scale)
      ? [this.scale[0], this.scale[1]]
      : [this.scale, this.scale];
  }
}

@NgModule({
  declarations: [NgtImage, NgtImageShaderMaterial],
  exports: [NgtImage, NgtImageShaderMaterial],
  imports: [NgtCoreModule, NgtMeshModule, NgtPlaneGeometryModule, CommonModule],
})
export class NgtImageModule {}
