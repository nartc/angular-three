import {
  EnhancedRxState,
  NgtAnimationFrameStore,
  NgtStore,
} from '@angular-three/core';
import { Injectable, NgZone } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, Observable, switchMap } from 'rxjs';
import * as THREE from 'three';
import { FBOReturn, NgtSobaFBO } from '../fbo/fbo.service';

interface NgtSobaDepthBufferState {
  size: number;
  frames: number;
  width: number;
  height: number;
  fbo: FBOReturn;
  depthConfig: { depthTexture: THREE.DepthTexture };
}

@Injectable()
export class NgtSobaDepthBuffer extends EnhancedRxState<NgtSobaDepthBufferState> {
  constructor(
    private sobaFbo: NgtSobaFBO,
    private store: NgtStore,
    private animationFrameStore: NgtAnimationFrameStore,
    private ngZone: NgZone
  ) {
    super();
    this.set({ size: 256, frames: Infinity });
  }

  use(
    options: { size?: number; frames?: number } = {}
  ): Observable<FBOReturn['depthTexture']> {
    return this.ngZone.runOutsideAngular(() => {
      if (options.size) {
        this.set({ size: options.size });
      }

      if (options.frames) {
        this.set({ frames: options.frames });
      }

      this.hold(
        combineLatest([
          this.store.ready$,
          this.store.select(selectSlice(['size', 'viewport'])),
        ]),
        ([
          ,
          {
            size: { width, height },
            viewport: { dpr },
          },
        ]) => {
          this.set({
            width: this.get('size') || width * dpr,
            height: this.get('size') || height * dpr,
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
          return { depthTexture };
        }
      );

      this.holdEffect(
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
            this.animationFrameStore.actions.unsubscriberUuid(animationUuid);
          };
        }
      );

      return this.select('fbo', 'depthTexture');
    });
  }
}

export const NGT_SOBA_DEPTH_BUFFER_PROVIDER = [NgtSobaFBO, NgtSobaDepthBuffer];
