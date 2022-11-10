import {
  NgtPortal,
  NgtRef,
  prepare,
  provideObjectHostRef,
  provideObjectRef,
  tapEffect,
} from '@angular-three/core';
import { NgtCubeCamera } from '@angular-three/core/cameras';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { filter, map } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaEnvironmentCube } from './environment-cube';
import {
  NgtSobaEnvironmentInputs,
  provideNgtSobaEnvironmentInputs,
} from './environment-inputs';
import { NgtSobaEnvironmentMap } from './environment-map';
import { setEnvProps } from './utils';

@Component({
  selector: 'ngt-soba-environment-portal',
  standalone: true,
  template: `
    <ngt-portal [container]="virtualScene">
      <ng-content></ng-content>

      <ngt-cube-camera
        *ngIf="fbo$ | async as fbo"
        [ref]="cubeCamera"
        [args]="[near, far, fbo]"
        (beforeRender)="onBeforeRender()"
      ></ngt-cube-camera>

      <ngt-soba-environment-cube
        *ngIf="files || preset; else environmentMap"
        background
        [files]="files"
        [preset]="preset"
        [path]="path"
        [extensions]="extensions"
      ></ngt-soba-environment-cube>

      <ng-template #environmentMap>
        <ngt-soba-environment-map
          background
          [map]="map"
          [extensions]="extensions"
        ></ngt-soba-environment-map>
      </ng-template>
    </ngt-portal>
  `,
  imports: [
    NgtPortal,
    NgtCubeCamera,
    NgIf,
    AsyncPipe,
    NgtSobaEnvironmentCube,
    NgtSobaEnvironmentMap,
  ],
  providers: [
    provideNgtSobaEnvironmentInputs(NgtSobaEnvironmentPortal),
    provideObjectRef(NgtSobaEnvironmentPortal, (portal) => portal.virtualScene),
    provideObjectHostRef(NgtSobaEnvironmentPortal),
  ],
})
export class NgtSobaEnvironmentPortal extends NgtSobaEnvironmentInputs {
  #count = 1;

  get virtualScene() {
    return this.get((s) => s['virtualScene']);
  }

  get cubeCamera() {
    return this.get((s) => s['cubeCamera']);
  }

  readonly fbo$ = this.select((s) => s['fbo']);

  readonly #setEnvironment = this.effect(
    tapEffect(() => {
      const { gl, scene: defaultScene } = this.store.get();
      const { frames, cubeCamera, virtualScene, background, scene, fbo, blur } =
        this.get();
      if (frames === 1 && cubeCamera.value)
        cubeCamera.value.update(gl, virtualScene.value);

      return setEnvProps(background, scene, defaultScene, fbo.texture, blur);
    })
  );

  override preInit() {
    super.preInit();
    this.set((s) => ({
      virtualScene: new NgtRef(
        prepare(
          new THREE.Scene(),
          this.store.get.bind(this.store),
          this.store.rootStateGetter
        )
      ),
      cubeCamera: new NgtRef(),
      near: s['near'] ?? 1,
      far: s['far'] ?? 1000,
      resolution: s['resolution'] ?? 256,
      frames: s['frames'] ?? 1,
      background: s['background'] ?? false,
    }));

    this.set(
      this.select(
        this.select((s) => s['resolution']),
        (resolution) => {
          const fbo = new THREE.WebGLCubeRenderTarget(resolution!);
          fbo.texture.type = THREE.HalfFloatType;
          return { fbo };
        }
      )
    );

    this.#setEnvironment(
      this.select(
        this.store.select((s) => s.gl),
        this.store.select((s) => s.scene),
        this.select((s) => s['scene']),
        this.select((s) => s['virtualScene']),
        this.fbo$.pipe(
          filter((fbo) => !!fbo),
          map((fbo) => fbo.texture)
        ),
        this.select((s) => s['background']),
        this.select((s) => s['frames'])
      )
    );
  }

  onBeforeRender() {
    const frames = this.get((s) => s['frames']);
    const gl = this.store.get((s) => s.gl);
    if (
      (frames === Infinity || this.#count < frames) &&
      this.cubeCamera.value
    ) {
      this.cubeCamera.value.update(gl, this.virtualScene.value);
      this.#count++;
    }
  }
}
