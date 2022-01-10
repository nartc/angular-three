import { EnhancedRxState, NgtStore } from '@angular-three/core';
import { Injectable, NgZone } from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, Observable } from 'rxjs';
import * as THREE from 'three';

interface FBOSettings<T extends boolean = false>
  extends THREE.WebGLRenderTargetOptions {
  multisample?: T;
  samples?: number;
}

export type FBOReturn<T extends boolean = false> = T extends true
  ? THREE.WebGLRenderTarget | THREE.WebGLMultisampleRenderTarget
  : THREE.WebGLRenderTarget;

@Injectable()
export class NgtSobaFBO extends EnhancedRxState<{
  target: THREE.WebGLRenderTarget | THREE.WebGLMultisampleRenderTarget;
  dpr: number;
  width: number;
  height: number;
  settings: FBOSettings<boolean>;
}> {
  constructor(private store: NgtStore, private ngZone: NgZone) {
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
    return this.ngZone.runOutsideAngular(() => {
      this.connect(
        'dpr',
        combineLatest([this.store.ready$, this.store.select('renderer')]),
        (_, [, renderer]) => renderer.getPixelRatio()
      );

      requestAnimationFrame(() => {
        this.connect('target', this.store.ready$, () => {
          const { multisample, samples, ...targetSettings } =
            this.get('settings');
          let target;
          if (multisample && this.store.get('renderer').capabilities.isWebGL2) {
            target = new THREE.WebGLMultisampleRenderTarget(
              this.get('width'),
              this.get('height'),
              targetSettings
            );
            if (samples) target.samples = samples;
          } else {
            target = new THREE.WebGLRenderTarget(
              this.get('width'),
              this.get('height'),
              targetSettings
            );
          }
          return target;
        });
      });

      this.hold(
        combineLatest([
          this.store.ready$,
          this.store.select('size'),
          this.select('dpr'),
        ]),
        ([_, size, dpr]) => {
          this.set({
            width: typeof width === 'number' ? width : size.width * dpr,
            height: typeof height === 'number' ? height : size.height * dpr,
            settings:
              (typeof width === 'number' ? settings : (width as FBOSettings)) ||
              {},
          });
        }
      );

      this.hold(
        this.select(selectSlice(['target', 'width', 'height'])),
        ({ target, height, width }) => {
          target.setSize(width, height);
        }
      );

      this.holdEffect(this.select('target'), (target) => {
        return () => {
          target.dispose();
        };
      });

      return this.select('target');
    });
  }
}
