import { Component, inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
import { provideCameraRef, provideObjectRef, provideSceneRef } from './di/three';
import { NgtRef } from './ref';
import { NgtResize } from './services/resize';
import { NgtComponentStore } from './stores/component-store';
import { NgtStore } from './stores/store';
import { tapEffect } from './stores/tap-effect';
import type { NgtEventManager, NgtSize, NgtState } from './types';
import { updateCamera } from './utils/camera';
import { prepare } from './utils/instance';
import { is } from './utils/is';

const privateKeys = [
  'setSize',
  'setFrameloop',
  'setDpr',
  'events',
  'invalidate',
  'advance',
  'size',
  'viewport',
] as const;

type PrivateKeys = typeof privateKeys[number];

export interface NgtPortalState {
  container: NgtRef<THREE.Object3D>;
  state: Partial<Omit<NgtState, PrivateKeys>>;
  size: NgtSize;
  events: Pick<NgtEventManager<any>, 'enabled' | 'priority' | 'compute' | 'connected'>;
}

@Component({
  selector: 'ngt-portal',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    NgtResize,
    NgtStore,
    provideObjectRef(NgtPortal, (portal) => portal.containerRef),
    provideSceneRef(NgtPortal, (portal) => portal.containerRef),
    provideCameraRef(NgtPortal, (portal) => portal.cameraRef),
  ],
})
export class NgtPortal extends NgtComponentStore<NgtPortalState> implements OnInit, OnDestroy {
  @Input() set container(container: NgtRef<THREE.Object3D> | THREE.Object3D) {
    this.set({
      container: is.ref(container) ? container : new NgtRef(container),
    });
  }

  @Input() set size(size: NgtPortalState['size']) {
    this.set({ size });
  }

  @Input() set events(events: NgtPortalState['events']) {
    this.set({ events });
  }

  @Input() set state(state: NgtPortalState['state']) {
    this.set({ state });
  }

  private readonly zone = inject(NgZone);
  private readonly portalStore = inject(NgtStore, { self: true });
  private readonly parentStore = inject(NgtStore, { skipSelf: true });

  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();

  private readonly subscribeToParentStore = this.effect<void>(
    tapEffect(() => {
      const sub = this.parentStore.state$.subscribe((parent) => {
        this.portalStore.set((portal) => this.inject(parent, portal));
      });

      return () => sub.unsubscribe();
    })
  );

  get containerRef() {
    return this.portalStore.getState((s) => s.sceneRef);
  }

  get cameraRef() {
    return this.portalStore.getState((s) => s.cameraRef);
  }

  override initialize() {
    super.initialize();
    this.set({
      state: {},
      container: new NgtRef(),
    });
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      // when the parent store is ready
      this.parentStore.onReady(() => {
        // init the portal store with previous state
        this.initPortalStore();
        // subscribe to parent store to inject state
        this.subscribeToParentStore();
        // set initial portal state
        this.setInitialPortalState();
      });
    });
  }

  private initPortalStore() {
    const parentState = this.parentStore.getState();
    const portalState = this.getState();
    const containerRef = portalState.container;
    let container = containerRef.value;

    if (!container) {
      container = prepare(
        new THREE.Scene(),
        this.portalStore.getState,
        this.portalStore.rootStateGetter,
        this.parentStore?.getState((s) => s.sceneRef)
      );
      containerRef.set(container);
    }

    this.portalStore.set({
      ...parentState,
      scene: container as THREE.Scene,
      sceneRef: containerRef as unknown as NgtRef<THREE.Scene>,
      raycaster: this.raycaster,
      pointer: this.pointer,
      previousRoot: this.parentStore.getState,
      events: { ...parentState.events, ...(portalState.events || {}) },
      size: { ...parentState.size, ...(portalState.size || {}) },
      ...portalState.state,
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.zone.runOutsideAngular(() => {
      const container = this.containerRef.value;
      if (container) {
        if ('removeFromParent' in container) {
          container.removeFromParent();
        }

        if ('clear' in container) {
          container.clear();
        }
      }
    });
  }

  private setInitialPortalState() {
    this.portalStore.set((portal) => this.inject(this.parentStore.getState(), portal));
  }

  private inject(parentState: NgtState, portalState: NgtState): Partial<NgtState> {
    const intersect: Partial<NgtState> = { ...parentState };

    Object.keys(parentState).forEach((key) => {
      if (
        privateKeys.includes(key as PrivateKeys) ||
        parentState[key as keyof NgtState] !== portalState[key as keyof NgtState]
      ) {
        delete intersect[key as PrivateKeys];
      }
    });

    const state = this.getState();
    let viewport = undefined;

    if (portalState && state.size) {
      const camera = portalState.camera;
      // calculate the viewport if present
      viewport = parentState.viewport.getCurrentViewport(camera, new THREE.Vector3(), state.size);
      // update the portal camera
      if (camera !== parentState.camera) {
        updateCamera(camera, state.size);
      }
    }

    return {
      ...intersect,
      scene: state.container.value as THREE.Scene,
      sceneRef: state.container as unknown as NgtRef<THREE.Scene>,
      raycaster: this.raycaster,
      pointer: this.pointer,
      previousRoot: this.parentStore.getState,
      events: {
        ...parentState.events,
        ...portalState.events,
        ...(state.events || {}),
      },
      size: { ...parentState.size, ...(state.size || {}) },
      viewport: { ...parentState.viewport, ...(viewport || {}) },
      ...state.state,
    };
  }
}
