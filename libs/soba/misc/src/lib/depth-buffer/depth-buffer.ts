import { NgtComponentStore, NgtStore, Ref, tapEffect } from '@angular-three/core';
import { Injectable, Provider } from '@angular/core';
import { filter, isObservable, map, Observable, of, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaFBO } from '../fbo/fbo';

export interface NgtSobaDepthBufferState {
  depthTexture: Ref<THREE.WebGLRenderTarget['depthTexture']>;
  depthFBO: THREE.WebGLRenderTarget;
  depthConfig: { depthTexture: THREE.WebGLRenderTarget['depthTexture'] };
  frames: number;
  size: number;
  width: number;
  height: number;
}

export interface NgtSobaDepthBufferParams {
  size?: number;
  frames?: number;
}

@Injectable()
export class NgtSobaDepthBuffer extends NgtComponentStore<NgtSobaDepthBufferState> {
  constructor(private store: NgtStore, private fbo: NgtSobaFBO) {
    super();
    this.set({ depthTexture: new Ref() });
  }

  private count = 0;
  private useSubscription?: Subscription;

  use(
    paramsFactory: (
      defaultParams: Partial<NgtSobaDepthBufferParams>
    ) => NgtSobaDepthBufferParams | Observable<NgtSobaDepthBufferParams>
  ): Ref<THREE.WebGLRenderTarget['depthTexture']> {
    if (this.useSubscription) {
      this.useSubscription.unsubscribe();
    }
    const params = paramsFactory({ size: 256, frames: Infinity });

    const params$ = isObservable(params) ? params : of(params);

    this.set(params$);

    const depthTextureRef = this.get((s) => s.depthTexture);

    this.useSubscription = this.onCanvasReady(
      this.store.ready$,
      () => {
        this.setDepthConfig(this.select((s) => s.size));
        this.setDepthFBO(this.select((s) => s.depthConfig));

        return () => {
          if (this.useSubscription) {
            this.useSubscription.unsubscribe();
          }
        };
      },
      true
    );

    return depthTextureRef;
  }

  private readonly setDepthConfig = this.effect<{}>(
    tap(() => {
      const size = this.get((s) => s.size);
      const dpr = this.store.get((s) => s.viewport.dpr);
      const { width, height } = this.store.get((s) => s.size);
      const w = size || width * dpr;
      const h = size || height * dpr;

      this.set({ width: w, height: h });
      this.set(
        this.select(
          this.select((s) => s.width),
          this.select((s) => s.height)
        ).pipe(
          map(() => {
            const { width, height } = this.get();
            const depthTexture = new THREE.DepthTexture(width, height);
            depthTexture.format = THREE.DepthFormat;
            depthTexture.type = THREE.UnsignedShortType;
            return { depthConfig: { depthTexture } };
          })
        )
      );
    })
  );

  private readonly setDepthFBO = this.effect<{}>(
    tapEffect(() => {
      const sub = this.fbo
        .use(() =>
          this.select(
            this.select((s) => s.depthConfig),
            this.select((s) => s.width),
            this.select((s) => s.height),
            (depthConfig, width, height) => ({
              width,
              height,
              settings: depthConfig,
            })
          )
        )
        .pipe(filter((fbo) => !!fbo))
        .subscribe((depthFBO) => {
          this.set({ depthFBO });
        });

      sub.add(this.setFboBeforeRender(this.select((s) => s.depthFBO)));

      return () => {
        sub.unsubscribe();
      };
    })
  );

  private readonly setFboBeforeRender = this.effect<{}>(
    tapEffect(() => {
      const { depthFBO, frames } = this.get();

      const unregister = this.store.registerBeforeRender({
        callback: ({ gl, scene, camera }) => {
          if (depthFBO && (frames === Infinity || this.count < frames)) {
            gl.setRenderTarget(depthFBO);
            gl.render(scene, camera);
            gl.setRenderTarget(null);
            this.count++;
          }
        },
      });

      return () => {
        unregister();
      };
    })
  );
}

export function provideSobaDepthBuffer(): Provider {
  return [NgtSobaFBO, NgtSobaDepthBuffer];
}
