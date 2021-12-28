import { NgtDestroyedService, NgtLoaderService } from '@angular-three/core';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  NgZone,
  Output,
} from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk';
import { BehaviorSubject, skipWhile, takeUntil, tap } from 'rxjs';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import {
  geometries,
  getY,
  worldDepth,
  worldHalfDepth,
  worldHalfWidth,
  worldWidth,
} from './world.utils';

@Component({
  selector: 'ngt-world',
  template: `
    <ngt-world-geometry (ready)="geometry = $event"></ngt-world-geometry>

    <ngt-mesh *ngIf="geometry" [geometry]="geometry">
      <ngt-mesh-lambert-material
        [parameters]="{ map: texture$ | async, side: side }"
      ></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldComponent {
  texture$ = this.loaderService
    .use(THREE.TextureLoader, '/assets/minecraft/atlas.png')
    .pipe(
      tap((texture) => {
        texture.magFilter = THREE.NearestFilter;
      })
    );
  side = THREE.DoubleSide;
  geometry?: THREE.BufferGeometry;

  constructor(private loaderService: NgtLoaderService) {}
}

@Component({
  selector: 'ngt-world-geometry',
  template: `
    <ngt-plane-geometry
      (ready)="onPlaneGeometryReady($event, 'pxPlane')"
      [args]="[100, 100]"
    ></ngt-plane-geometry>
    <ngt-plane-geometry
      (ready)="onPlaneGeometryReady($event, 'pyPlane')"
      [args]="[100, 100]"
    ></ngt-plane-geometry>
    <ngt-plane-geometry
      (ready)="onPlaneGeometryReady($event, 'pzPlane')"
      [args]="[100, 100]"
    ></ngt-plane-geometry>
    <ngt-plane-geometry
      (ready)="onPlaneGeometryReady($event, 'nxPlane')"
      [args]="[100, 100]"
    ></ngt-plane-geometry>
    <ngt-plane-geometry
      (ready)="onPlaneGeometryReady($event, 'nzPlane')"
      [args]="[100, 100]"
    ></ngt-plane-geometry>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtDestroyedService],
})
export class WorldGeometryComponent {
  @Output() ready = new EventEmitter<THREE.BufferGeometry>();

  #planes$ = new BehaviorSubject<
    Record<keyof typeof geometries, THREE.PlaneGeometry>
  >({} as Record<keyof typeof geometries, THREE.PlaneGeometry>);

  #matrix = new THREE.Matrix4();
  #geometries: THREE.BufferGeometry[] = [];

  constructor(private ngZone: NgZone, private destroyed: NgtDestroyedService) {}

  ngOnInit() {
    this.#planes$
      .pipe(
        skipWhile((planes) => Object.keys(planes).length < 5),
        takeUntil(this.destroyed)
      )
      .subscribe(({ nxPlane, nzPlane, pxPlane, pyPlane, pzPlane }) => {
        requestAnimationFrame(() => {
          for (let z = 0; z < worldDepth; z++) {
            for (let x = 0; x < worldWidth; x++) {
              const h = getY(x, z);

              this.#matrix.makeTranslation(
                x * 100 - worldHalfWidth * 100,
                h * 100,
                z * 100 - worldHalfDepth * 100
              );

              const px = getY(x + 1, z);
              const nx = getY(x - 1, z);
              const pz = getY(x, z + 1);
              const nz = getY(x, z - 1);

              this.#geometries.push(pyPlane.clone().applyMatrix4(this.#matrix));

              if ((px !== h && px !== h + 1) || x === 0) {
                this.#geometries.push(
                  pxPlane.clone().applyMatrix4(this.#matrix)
                );
              }

              if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) {
                this.#geometries.push(
                  nxPlane.clone().applyMatrix4(this.#matrix)
                );
              }

              if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) {
                this.#geometries.push(
                  pzPlane.clone().applyMatrix4(this.#matrix)
                );
              }

              if ((nz !== h && nz !== h + 1) || z === 0) {
                this.#geometries.push(
                  nzPlane.clone().applyMatrix4(this.#matrix)
                );
              }
            }
          }

          const bufferGeometry = BufferGeometryUtils.mergeBufferGeometries(
            this.#geometries
          );
          bufferGeometry.computeBoundingSphere();
          this.ready.emit(bufferGeometry);
        });
      });
  }

  onPlaneGeometryReady(
    plane: THREE.PlaneGeometry,
    name: keyof typeof geometries
  ) {
    const { uv, rotate, translate } = geometries[name];
    // @ts-ignore
    plane.attributes.uv.array[uv[0]] = 0.5;
    // @ts-ignore
    plane.attributes.uv.array[uv[1]] = 0.5;
    if (rotate[0]) {
      plane[rotate[0]](rotate[1]);
    }
    plane.translate(...(translate as [number, number, number]));
    this.#planes$.next({
      ...this.#planes$.getValue(),
      [name]: plane,
    });
  }
}
