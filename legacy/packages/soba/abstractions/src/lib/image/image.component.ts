import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtColor,
  NgtCoreModule,
  NgtObject3dController,
} from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaExtender } from '@angular-three/soba';
import { TextureLoaderService } from '@angular-three/soba/loaders';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaImageShaderMaterial } from './image-shader-material.directive';

@Component({
  selector: 'ngt-soba-image[url]',
  exportAs: 'ngtSobaImage',
  template: `
    <ng-container *ngIf="texture$ | async as texture">
      <ngt-mesh
        [scale]="scale"
        [object3dController]="object3dController"
        (ready)="ready.emit($event)"
        (animateReady)="animateReady.emit($event)"
      >
        <ngt-plane-geometry
          [args]="[1, 1, segments, segments]"
        ></ngt-plane-geometry>
        <ngt-soba-image-shader-material
          [parameters]="{color, map: texture, zoom, grayscale, scale: planeBounds, imageBounds}"
        ></ngt-soba-image-shader-material>
        <ng-content></ng-content>
      </ngt-mesh>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER],
})
export class NgtSobaImage
  extends NgtSobaExtender<THREE.Mesh>
  implements OnChanges
{
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

  planeBounds?: [number, number];
  imageBounds?: [number, number];

  texture$?: Observable<THREE.Texture>;

  constructor(
    private textureLoaderService: TextureLoaderService,
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.planeBounds = Array.isArray(this.scale)
      ? [this.scale[0], this.scale[1]]
      : [this.scale, this.scale];
  }
}

@NgModule({
  declarations: [NgtSobaImage, NgtSobaImageShaderMaterial],
  exports: [NgtSobaImage, NgtSobaImageShaderMaterial],
  imports: [NgtCoreModule, NgtMeshModule, NgtPlaneGeometryModule, CommonModule],
})
export class NgtImageModule {}
