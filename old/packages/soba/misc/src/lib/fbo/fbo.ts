import { NgtCanvasStore, NgtStore } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, Observable } from 'rxjs';
import * as THREE from 'three';
import { WebGLRenderTargetOptions } from 'three';

interface FBOSettings<T extends boolean = false>
  extends THREE.WebGLRenderTargetOptions {
  multisample?: T;
  samples?: number;
}

export type FBOReturn<T extends boolean = false> = T extends true
  ? THREE.WebGLRenderTarget | THREE.WebGLMultisampleRenderTarget
  : THREE.WebGLRenderTarget;

@Injectable()
export class NgtSobaFBO extends NgtStore<{
  target: THREE.WebGLRenderTarget | THREE.WebGLMultisampleRenderTarget;
  dpr: number;
  width: number;
  height: number;
  settings: FBOSettings<boolean>;
}> {
  constructor(private canvasStore: NgtCanvasStore) {
    super();
  }

  use<T extends boolean = false>(
    settings?: FBOSettings<T>
  ): Observable<FBOReturn<T>>;
  use<T extends boolean = false>(
    width?: number,
    height?: number,
    settings?: FBOSettings<T>
  ): Observable<FBOReturn<T>>;
  use<T extends boolean = false>(
    width?: number | FBOSettings<T>,
    height?: number,
    settings?: FBOSettings<T>
  ): Observable<FBOReturn<T>> {
    this.connect(
      'dpr',
      combineLatest([
        this.canvasStore.ready$,
        this.canvasStore.select('renderer')
      ]),
      (_, [, renderer]) => renderer.getPixelRatio()
    );

    this.connect('target',
      combineLatest([
        this.canvasStore.ready$,
        this.select(selectSlice(['width', 'height', 'settings']))
      ])
      , (_, [, { width, height, settings }]) => {
        const { multisample, samples, ...targetSettings } =
        settings || {};

        let target;
        if (
          multisample &&
          this.canvasStore.get('renderer').capabilities.isWebGL2
        ) {
          target = new THREE.WebGLMultisampleRenderTarget(
            width,
            height,
            targetSettings as WebGLRenderTargetOptions
          );
          if (samples) target.samples = samples;
        } else {
          target = new THREE.WebGLRenderTarget(
            width,
            height,
            targetSettings as WebGLRenderTargetOptions
          );
        }
        return target;
      });

    this.hold(
      combineLatest([
        this.canvasStore.ready$,
        this.canvasStore.select('size'),
        this.select('dpr')
      ]),
      ([_, size, dpr]) => {
        this.set({
          width: typeof width === 'number' ? width : size.width * dpr,
          height: typeof height === 'number' ? height : size.height * dpr,
          settings:
            (typeof width === 'number' ? settings : (width as FBOSettings)) ||
            {}
        });
      }
    );

    this.hold(
      this.select(selectSlice(['target', 'width', 'height'])),
      ({ target, height, width }) => {
        target.setSize(width, height);
      }
    );

    this.effect(this.select('target'), (target) => {
      return () => {
        target.dispose();
      };
    });

    return this.select('target');
  }
}
