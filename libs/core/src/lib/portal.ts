import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  inject,
  Input,
  NgZone,
  OnInit,
  TemplateRef,
} from '@angular/core';
import * as THREE from 'three';
import {
  provideCameraRef,
  provideObjectRef,
  provideSceneRef,
} from './di/object';
import { NgtRef } from './ref';
import { NgtResize } from './services/resize';
import { NgtComponentStore, tapEffect } from './stores/component-store';
import { NgtStore } from './stores/store';
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

@Directive({
  selector: 'ng-template[ngt-portal-content]',
  standalone: true,
  exportAs: 'ngtPortalContent',
})
export class NgtPortalContent {
  readonly templateRef = inject(TemplateRef);
}

export interface NgtPortalState {
  container: NgtRef<THREE.Object3D>;
  state: Partial<Omit<NgtState, PrivateKeys>>;
  size: NgtSize;
  events: Pick<
    NgtEventManager<any>,
    'enabled' | 'priority' | 'compute' | 'connected'
  >;
}

@Component({
  selector: 'ngt-portal',
  standalone: true,
  template: `
    <ng-container
      *ngIf="content"
      [ngTemplateOutlet]="content.templateRef"
    ></ng-container>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NgtResize,
    NgtStore,
    provideObjectRef(NgtPortal, (portal) => portal.containerRef),
    provideSceneRef(NgtPortal, (portal) => portal.containerRef),
    provideCameraRef(NgtPortal, (portal) => portal.cameraRef),
  ],
  imports: [NgIf, NgTemplateOutlet],
})
export class NgtPortal
  extends NgtComponentStore<NgtPortalState>
  implements OnInit
{
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

  @ContentChild(NgtPortalContent) content?: NgtPortalContent;

  readonly #zone = inject(NgZone);
  readonly #portalStore = inject(NgtStore, { self: true });
  readonly #parentStore = inject(NgtStore, { skipSelf: true });

  readonly #raycaster = new THREE.Raycaster();
  readonly #pointer = new THREE.Vector2();

  readonly #subscribeToParentStore = this.effect<void>(
    tapEffect(() => {
      const sub = this.#parentStore.select().subscribe((parent) => {
        this.#portalStore.set((portal) => this.#inject(parent, portal));
      });

      return () => sub.unsubscribe();
    })
  );

  get containerRef() {
    return this.#portalStore.get((s) => s.sceneRef);
  }

  get cameraRef() {
    return this.#portalStore.get((s) => s.cameraRef);
  }

  ngOnInit() {
    this.#zone.runOutsideAngular(() => {
      this.set((s) => ({
        state: s.state ?? {},
        container: s.container ?? new NgtRef(),
      }));

      // when the parent store is ready
      this.#parentStore.onReady(() => {
        // init the portal store with previous state
        this.#initPortalStore();
        // subscribe to parent store to inject state
        this.#subscribeToParentStore();
        // set initial portal state
        this.#setInitialPortalState();
      });
    });
  }

  #initPortalStore() {
    const parentState = this.#parentStore.get();
    const portalState = this.get();
    const containerRef = portalState.container;
    let container = containerRef.value;

    if (!container) {
      container = prepare(
        new THREE.Scene(),
        this.#portalStore.get.bind(this.#portalStore),
        this.#parentStore?.get((s) => s.sceneRef)
      );
      containerRef.set(container);
    }

    this.#portalStore.set({
      ...parentState,
      scene: container,
      sceneRef: containerRef,
      raycaster: this.#raycaster,
      pointer: this.#pointer,
      previousRoot: this.#parentStore.get.bind(this.#parentStore),
      events: { ...parentState.events, ...(portalState.events || {}) },
      size: { ...parentState.size, ...(portalState.size || {}) },
      ...portalState.state,
      setEvents: (events) =>
        this.set((s) => ({ events: { ...s.events, ...events } })),
    });
  }

  #setInitialPortalState() {
    this.#portalStore.set((portal) =>
      this.#inject(this.#parentStore.get(), portal)
    );
  }

  #inject(parentState: NgtState, portalState: NgtState): Partial<NgtState> {
    const intersect: Partial<NgtState> = { ...parentState };

    Object.keys(parentState).forEach((key) => {
      if (
        privateKeys.includes(key as PrivateKeys) ||
        parentState[key as keyof NgtState] !==
          portalState[key as keyof NgtState]
      ) {
        delete intersect[key as PrivateKeys];
      }
    });

    const state = this.get();
    let viewport = undefined;

    if (portalState && state.size) {
      const camera = portalState.camera;
      // calculate the viewport if present
      viewport = parentState.viewport.getCurrentViewport(
        camera,
        new THREE.Vector3(),
        state.size
      );
      // update the portal camera
      if (camera !== parentState.camera) {
        updateCamera(camera, state.size);
      }
    }

    return {
      ...intersect,
      scene: state.container.value as THREE.Scene,
      sceneRef: state.container as unknown as NgtRef<THREE.Scene>,
      raycaster: this.#raycaster,
      pointer: this.#pointer,
      previousRoot: this.#parentStore.get.bind(this.#parentStore),
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
