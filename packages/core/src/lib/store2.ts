import { is, NgtBeforeRenderCallback, NgtDomEvent, NgtEquConfig } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import * as THREE from 'three';
import { StoreApi } from 'zustand/vanilla';
import { injectWindow } from './di/window';
import { createLoop } from './loop';
import { NgtState, NgtViewport } from './types';

export const rootStateMap = new Map<Element, any>();
const { invalidate, advance } = createLoop(rootStateMap);
const shallowLoose = { objects: 'shallow', strict: false } as NgtEquConfig;

@Injectable()
export class NgtStore extends RxState<
  Omit<NgtState, 'previousStore'> & { previousStore?: RxState<Omit<NgtState, 'previousStore'>> }
> {
  private readonly window = injectWindow();

  private isInit = false;

  init() {
    if (!this.isInit) {
      const position = new THREE.Vector3();
      const defaultTarget = new THREE.Vector3();
      const tempTarget = new THREE.Vector3();

      const getCurrentViewport = (
        camera = this.get('camera'),
        target: THREE.Vector3 | Parameters<THREE.Vector3['set']> = defaultTarget,
        size = this.get('size')
      ): Omit<NgtViewport, 'dpr' | 'initialDpr'> => {
        const { width, height, top, left } = size;
        const aspect = width / height;
        if (target instanceof THREE.Vector3) tempTarget.copy(target);
        else tempTarget.set(...target);

        const distance = camera.getWorldPosition(position).distanceTo(tempTarget);

        if (is.orthographic(camera)) {
          return {
            width: width / camera.zoom,
            height: height / camera.zoom,
            top,
            left,
            factor: 1,
            distance,
            aspect,
          };
        }

        const fov = (camera.fov * Math.PI) / 180; // convert vertical fov to radians
        const h = 2 * Math.tan(fov / 2) * distance; // visible height
        const w = h * (width / height);
        return {
          width: w,
          height: h,
          top,
          left,
          factor: width / w,
          distance,
          aspect,
        };
      };

      const pointer = new THREE.Vector2();

      let performanceTimeout: ReturnType<typeof setTimeout>;

      const setPerformanceCurrent = (current: number) => {
        this.set((s) => ({ performance: { ...s.performance, current } }));
      };

      this.set({
        ready: false,
        events: { priority: 1, enabled: true, connected: false },
        invalidate: (frames = 1) => invalidate(this.get() as any, frames),
        advance: (timestamp: number, runGlobalEffects?: boolean) =>
          advance(timestamp, runGlobalEffects, this.get() as any),
        legacy: false,
        linear: false,
        flat: false,
        controls: null,
        clock: new THREE.Clock(),
        pointer,
        frameloop: 'always',
        performance: {
          current: 1,
          min: 0.5,
          max: 1,
          debounce: 200,
          regress: () => {
            const state = this.get();
            // Clear timeout
            if (performanceTimeout) clearTimeout(performanceTimeout);
            // Set lower bound performance
            if (state.performance.current !== state.performance.min)
              setPerformanceCurrent(state.performance.min);
            // Go back to upper bound performance after a while unless something regresses meanwhile
            performanceTimeout = setTimeout(
              () => setPerformanceCurrent(this.get('performance', 'max') || 1),
              state.performance.debounce
            );
          },
        },
        size: {
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          updateStyle: false,
        },
        viewport: {
          initialDpr: 0,
          dpr: 0,
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          aspect: 0,
          distance: 0,
          factor: 0,
          getCurrentViewport,
        },
        internal: {
          active: false,
          priority: 0,
          frames: 0,
          lastEvent: null as unknown as NgtDomEvent,
          interaction: [],
          hovered: new Map(),
          subscribers: [],
          initialClick: [0, 0],
          initialHits: [],
          capturedMap: new Map(),

          subscribe: (
            callback: NgtBeforeRenderCallback,
            priority: number = 0,
            store: StoreApi<NgtState>,
            obj?: THREE.Object3D
          ) => {
            const internal = this.get('internal');
            // If this subscription was given a priority, it takes rendering into its own hands
            // For that reason we switch off automatic rendering and increase the manual flag
            // As long as this flag is positive there can be no internal rendering at all
            // because there could be multiple render subscriptions
            internal.priority = internal.priority + (priority > 0 ? 1 : 0);
            internal.subscribers.push({
              priority,
              store,
              callback,
              obj,
            });
            // Register subscriber and sort layers from lowest to highest, meaning,
            // highest priority renders last (on top of the other frames)
            internal.subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
            return () => {
              const internal = this.get('internal');
              if (internal?.subscribers) {
                // Decrease manual flag if this subscription had a priority
                internal.priority = internal.priority - (priority > 0 ? 1 : 0);
                // Remove subscriber from list
                internal.subscribers = internal.subscribers.filter((s) => s.callback !== callback);
              }
            };
          },
        },
      });
    }
  }
}
