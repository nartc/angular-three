import {
  extend,
  injectNgtRef,
  NgtArgs,
  NgtPortal,
  NgtPortalContent,
  NgtRef,
  prepare,
} from '@angular-three/core';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { combineLatest } from 'rxjs';
import { CubeCamera, HalfFloatType, Scene, WebGLCubeRenderTarget } from 'three';
import { NgtsEnvironmentCube } from './environment-cube';
import { NgtsEnvironmentInputs } from './environment-inputs';
import { NgtsEnvironmentMap } from './environment-map';
import { setEnvProps } from './utils';

extend({ CubeCamera });

@Component({
  selector: 'ngts-environment-portal',
  standalone: true,
  template: `
    <ngt-portal [container]="virtualSceneRef">
      <ng-template ngtPortalContent>
        <ng-content></ng-content>
        <ng-container *args="get('cameraArgs')">
          <ngt-cube-camera *ref="cubeCameraRef"></ngt-cube-camera>
        </ng-container>
        <ng-container *ngIf="get('files') || get('preset'); else environmentMap">
          <ngts-environment-cube
            [background]="true"
            [files]="get('files')"
            [preset]="get('preset')"
            [path]="get('path')"
            [extensions]="get('extensions')"
          ></ngts-environment-cube>
        </ng-container>
        <ng-template #environmentMap>
          <ngts-environment-map
            [background]="true"
            [map]="get('map')"
            [extensions]="get('extensions')"
          ></ngts-environment-map>
        </ng-template>
      </ng-template>
    </ngt-portal>
  `,
  imports: [
    NgtPortalContent,
    NgtPortal,
    NgtsEnvironmentMap,
    NgtsEnvironmentCube,
    NgIf,
    NgtArgs,
    NgtRef,
  ],
  providers: [RxActionFactory],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsEnvironmentPortal extends NgtsEnvironmentInputs implements OnInit {
  readonly virtualSceneRef = injectNgtRef<Scene>(prepare(new Scene()));
  readonly cubeCameraRef = injectNgtRef<CubeCamera>();
  readonly #actions = inject(RxActionFactory<{ setBeforeRender: void }>).create();

  override initialize(): void {
    super.initialize();
    this.set({
      near: 1,
      far: 1000,
      resolution: 256,
      frames: 1,
      background: false,
      preset: undefined,
    });
    this.connect(
      'fbo',
      this.select(['resolution'], ({ resolution }) => {
        const fbo = new WebGLCubeRenderTarget(resolution);
        fbo.texture.type = HalfFloatType;
        return fbo;
      })
    );
    this.connect(
      'cameraArgs',
      this.select(['fbo', 'near', 'far'], ({ near, far, fbo }) => [near, far, fbo])
    );
  }

  ngOnInit(): void {
    this.#setEnvProps();
    this.#setBeforeRender();
  }

  #setEnvProps() {
    this.effect(
      combineLatest([
        this.store.select(selectSlice(['gl', 'scene'])),
        this.select(selectSlice(['fbo', 'scene', 'background', 'frames', 'blur'])),
        this.virtualSceneRef.$,
        this.cubeCameraRef.$,
      ]),
      ([
        { gl, scene: defaultScene },
        { fbo, scene, background, frames, blur },
        virtualScene,
        camera,
      ]) => {
        if (frames === 1) camera.update(gl, virtualScene);
        return setEnvProps(background, scene, defaultScene, fbo.texture, blur);
      }
    );
  }

  #setBeforeRender() {
    let count = 1;
    this.effect(this.#actions.setBeforeRender$, () =>
      this.store.get('internal').subscribe(() => {
        const { frames } = this.get();
        const gl = this.store.get('gl');
        if (frames === Infinity || count < frames) {
          if (this.cubeCameraRef.nativeElement) {
            this.cubeCameraRef.nativeElement.update(gl, this.virtualSceneRef.nativeElement);
            count++;
          }
        }
      })
    );
    this.#actions.setBeforeRender();
  }
}
