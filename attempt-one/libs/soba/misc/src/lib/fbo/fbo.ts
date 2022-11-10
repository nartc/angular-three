import {
  NgtComponentStore,
  NgtRef,
  NgtStore,
  tapEffect,
} from '@angular-three/core';
import { inject, Injectable } from '@angular/core';
import { filter, isObservable, Observable, of, tap } from 'rxjs';
import * as THREE from 'three';

interface FBOSettings<T extends boolean = false>
  extends THREE.WebGLRenderTargetOptions {
  multisample?: T;
  samples?: number;
}

interface NgtSobaFBOState {
  target: NgtRef<THREE.WebGLRenderTarget>;
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
  readonly #store = inject(NgtStore);

  constructor() {
    super();
    this.set({ target: new NgtRef() });
  }

  readonly #setTarget = this.effect<NgtSobaFBOParams>(
    tap(({ width, height, settings }) => {
      const targetRef = this.get((s) => s.target);
      const { gl, size, viewport } = this.#store.get();

      const _width =
        typeof width === 'number' ? width : size.width * viewport.dpr;
      const _height =
        typeof height === 'number' ? height : size.height * viewport.dpr;
      const _settings =
        (typeof width === 'number' ? settings : (width as FBOSettings)) || {};

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

  readonly #setup = this.effect(
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

  use<T extends boolean = false>(
    paramsFactory: (
      defaultParams: Partial<NgtSobaFBOParams<T>>
    ) => NgtSobaFBOParams<T> | Observable<NgtSobaFBOParams<T>>
  ): NgtRef<THREE.WebGLRenderTarget> {
    const targetRef = this.get((s) => s.target);
    const params = paramsFactory({});
    const params$ = isObservable(params) ? params : of(params);

    this.#store.onReady(() => {
      this.#setTarget(params$ as Observable<NgtSobaFBOParams>);
      this.#setup(
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
}
