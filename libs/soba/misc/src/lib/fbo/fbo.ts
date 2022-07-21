import { NgtComponentStore, NgtStore, Ref, tapEffect } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { filter, isObservable, Observable, of, tap } from 'rxjs';
import * as THREE from 'three';

interface FBOSettings<T extends boolean = false> extends THREE.WebGLRenderTargetOptions {
  multisample?: T;
  samples?: number;
}

interface NgtSobaFBOState {
  target: Ref<THREE.WebGLRenderTarget>;
  width: number;
  height: number;
  settings: FBOSettings<boolean>;
}

export interface NgtSobaFBOParams<T extends boolean = false> {
  width?: number | FBOSettings<T>;
  height?: number;
  settings?: FBOSettings<T>;
}

@Injectable()
export class NgtSobaFBO extends NgtComponentStore<NgtSobaFBOState> {
  constructor(private store: NgtStore) {
    super();
    this.set({ target: new Ref() });
  }

  use<T extends boolean = false>(
    paramsFactory: (defaultParams: Partial<NgtSobaFBOParams>) => NgtSobaFBOParams | Observable<NgtSobaFBOParams>
  ): Ref<THREE.WebGLRenderTarget> {
    const targetRef = this.get((s) => s.target);
    const params = paramsFactory({});
    const params$ = isObservable(params) ? params : of(params);

    this.onCanvasReady(this.store.ready$, () => {
      this.setTarget(params$);
      this.setup(
        this.select(
          targetRef.pipe(filter((target) => !!target)),
          this.select((s) => s.width),
          this.select((s) => s.height),
          this.select((s) => s.settings)
        )
      );
    });

    return targetRef;
  }

  private readonly setTarget = this.effect<{
    width?: number | FBOSettings<any>;
    height?: number;
    settings?: FBOSettings<any>;
  }>(
    tap(({ width, height, settings }) => {
      const targetRef = this.get((s) => s.target);
      const { gl, size, viewport } = this.store.get();

      const _width = typeof width === 'number' ? width : size.width * viewport.dpr;
      const _height = typeof height === 'number' ? height : size.height * viewport.dpr;
      const _settings = (typeof width === 'number' ? settings : (width as FBOSettings)) || {};

      const { samples, ...targetSettings } = _settings;

      targetRef.set(() => {
        const target = new THREE.WebGLRenderTarget(_width, _height, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          type: THREE.HalfFloatType,
          encoding: gl.outputEncoding,
          ...(targetSettings || {}),
        });
        if (samples) {
          target.samples = samples;
        }
        return target;
      });

      this.set({
        width: _width,
        height: _height,
        settings: _settings,
      });
    })
  );

  private readonly setup = this.effect<{}>(
    tapEffect(() => {
      const {
        target,
        width,
        height,
        settings: { samples },
      } = this.get();

      target.value.setSize(width, height);
      if (samples) target.value.samples = samples;

      return ({ complete }) => {
        if (complete) {
          target.value.dispose();
        }
      };
    })
  );
}
