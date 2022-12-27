import {
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Raycaster, Scene, Vector2, Vector3 } from 'three';
import { NgtRxStore } from './stores/rx-store';
import { injectNgtStore, NgtStore } from './stores/store';
import { NgtEventManager, NgtSize, NgtState } from './types';
import { getLocalState } from './utils/instance';
import { updateCamera } from './utils/update';

const privateKeys = [
  'get',
  'set',
  'select',
  'setSize',
  'setDpr',
  'setFrameloop',
  'events',
  'invalidate',
  'advance',
  'size',
  'viewport',
  'addInteraction',
  'removeInteraction',
] as const;
type PrivateKeys = typeof privateKeys[number];

export interface NgtPortalInputs {
  container: ElementRef<THREE.Object3D> | THREE.Object3D;
  camera: ElementRef<THREE.Camera> | THREE.Camera;
  state: Partial<
    Omit<NgtState, PrivateKeys> & {
      events: Partial<Pick<NgtEventManager<any>, 'enabled' | 'priority' | 'compute' | 'connected'>>;
      size: NgtSize;
    }
  >;
}

@Directive({
  selector: 'ng-template[ngtPortalContent]',
  standalone: true,
})
export class NgtPortalContent {}

@Component({
  selector: 'ngt-portal[container]',
  standalone: true,
  template: '<ng-container #portalContentAnchor></ng-container>',
  providers: [NgtStore],
})
export class NgtPortal extends NgtRxStore<NgtPortalInputs> implements OnInit, OnDestroy {
  @Input() set container(container: NgtPortalInputs['container']) {
    this.set({ container });
  }

  @Input() set camera(camera: NgtPortalInputs['camera']) {
    this.set({ camera });
  }

  @Input() set state(state: NgtPortalInputs['state']) {
    this.set({ state });
  }

  @ContentChild(NgtPortalContent, { read: TemplateRef, static: true })
  readonly portalContentTemplate!: TemplateRef<unknown>;

  @ViewChild('portalContentAnchor', { read: ViewContainerRef, static: true })
  readonly portalContentAnchor!: ViewContainerRef;

  readonly #parentStore = injectNgtStore({ skipSelf: true });
  readonly #portalStore = injectNgtStore({ self: true });

  readonly #raycaster = new Raycaster();
  readonly #pointer = new Vector2();

  #portalContentView?: EmbeddedViewRef<unknown>;

  ngOnInit() {
    const previousState = this.#parentStore.get();
    const inputsState = this.get();

    const { events, size, ...restInputsState } = inputsState.state || {};

    const containerState = inputsState.container;
    const container =
      containerState instanceof ElementRef ? containerState.nativeElement : containerState;

    const localState = getLocalState(container);
    if (!localState.store) {
      localState.store = this.#portalStore;
    }

    this.#portalStore.set({
      ...previousState,
      scene: container as Scene,
      raycaster: this.#raycaster,
      pointer: this.#pointer,
      previousStore: this.#parentStore,
      events: { ...previousState.events, ...(events || {}) },
      size: { ...previousState.size, ...(size || {}) },
      ...restInputsState,
      get: this.#portalStore.get.bind(this.#portalStore),
      set: this.#portalStore.set.bind(this.#portalStore),
      select: this.#portalStore.select.bind(this.#portalStore),
      setEvents: (events) =>
        this.#portalStore.set((state) => ({ ...state, events: { ...state.events, ...events } })),
    });

    this.hold(this.#parentStore.select(), (previous) =>
      this.#portalStore.set((state) => this.#inject(previous, state))
    );
    requestAnimationFrame(() => {
      this.#portalStore.set((injectState) => this.#inject(this.#parentStore.get(), injectState));
    });

    this.#portalContentView = this.portalContentAnchor.createEmbeddedView(
      this.portalContentTemplate
    );
    this.#portalContentView.detectChanges();
  }

  override ngOnDestroy() {
    if (this.#portalContentView && !this.#portalContentView.destroyed) {
      this.#portalContentView.destroy();
    }
    super.ngOnDestroy();
  }

  #inject(rootState: NgtState, injectState: NgtState) {
    const intersect: Partial<NgtState> = { ...rootState };

    Object.keys(intersect).forEach((key) => {
      if (
        privateKeys.includes(key as PrivateKeys) ||
        rootState[key as keyof NgtState] !== injectState[key as keyof NgtState]
      ) {
        delete intersect[key as keyof NgtState];
      }
    });

    const inputs = this.get();
    const { size, events, ...restInputsState } = inputs.state || {};

    let viewport = undefined;
    if (injectState && size) {
      const camera = injectState.camera;
      viewport = rootState.viewport.getCurrentViewport(camera, new Vector3(), size);
      if (camera !== rootState.camera) updateCamera(camera, size);
    }

    return {
      ...intersect,
      scene:
        inputs.container instanceof ElementRef ? inputs.container.nativeElement : inputs.container,
      raycaster: this.#raycaster,
      pointer: this.#pointer,
      previousStore: this.#parentStore,
      events: { ...rootState.events, ...(injectState?.events || {}), ...events },
      size: { ...rootState.size, ...size },
      viewport: { ...rootState.viewport, ...(viewport || {}) },
      ...restInputsState,
    } as NgtState;
  }
}
