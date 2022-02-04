import {
  NgtAnimationFrameStore,
  NgtCanvasStore,
  NgtStore,
} from '@angular-three/core';
import { Injectable } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import * as THREE from 'three';
import { FBOReturn, NgtSobaFBO } from '../fbo/fbo';

interface NgtSobaDepthBufferState {
  size: number;
  frames: number;
  width: number;
  height: number;
  fbo: FBOReturn;
  depthConfig: { depthTexture: THREE.DepthTexture };
}

@Injectable()
export class NgtSobaDepthBuffer extends NgtStore<NgtSobaDepthBufferState> {
  constructor(
    private sobaFbo: NgtSobaFBO,
    private canvasStore: NgtCanvasStore,
    private animationFrameStore: NgtAnimationFrameStore
  ) {
    super();
    this.set({ size: 256, frames: Infinity });
  }

  use(
    options: { size?: number; frames?: number } = {}
  ): Observable<FBOReturn['depthTexture']> {
    if (options.size) {
      this.set({ size: options.size });
    }

    if (options.frames) {
      this.set({ frames: options.frames });
    }

    this.hold(
      combineLatest([
        this.canvasStore.ready$,
        this.canvasStore.select(selectSlice(['size', 'viewport'])),
      ]),
      ([
        ,
        {
          size: { width, height },
          viewport: { dpr },
        },
      ]) => {
        const size = this.get('size');
        this.set({
          width: size || width * dpr,
          height: size || height * dpr,
        });
      }
    );

    this.connect(
      'depthConfig',
      this.select(selectSlice(['width', 'height'])),
      (_, { width, height }) => {
        const depthTexture = new THREE.DepthTexture(width, height);
        depthTexture.format = THREE.DepthFormat;
        depthTexture.type = THREE.UnsignedShortType;

        const linear = this.canvasStore.get('linear');

        if (linear) {
          depthTexture.encoding = THREE.LinearEncoding;
        } else {
          depthTexture.encoding = THREE.sRGBEncoding;
        }

        return { depthTexture };
      }
    );

    this.effect(
      this.select(selectSlice(['width', 'height', 'depthConfig'])).pipe(
        switchMap(({ width, height, depthConfig }) =>
          this.sobaFbo.use(width, height, depthConfig)
        )
      ),
      (depthFBO) => {
        this.set({ fbo: depthFBO });
        let count = 0;
        const animationUuid = this.animationFrameStore.register({
          callback: ({ renderer, scene, camera }) => {
            const frames = this.get('frames');
            if (frames === Infinity || count < frames) {
              renderer.setRenderTarget(depthFBO);
              renderer.render(scene, camera);
              renderer.setRenderTarget(null);
              count++;
            }
          },
        });

        return () => {
          this.animationFrameStore.actions.unregister(animationUuid);
        };
      }
    );

    return this.select('fbo').pipe(map((fbo) => fbo.depthTexture));
  }
}

export const NGT_SOBA_DEPTH_BUFFER_PROVIDER = [NgtSobaFBO, NgtSobaDepthBuffer];
