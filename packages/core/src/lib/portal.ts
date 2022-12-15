import {
  Component,
  ContentChild,
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
import create from 'zustand/vanilla';
import { injectNgtStore, provideNgtStore } from './store';
import type { NgtEventManager, NgtSize, NgtState } from './types';
import { updateCamera } from './utils/camera';
import { is } from './utils/is';
import { ref } from './utils/ref';

const privateKeys = [
  'get',
  'set',
  'setSize',
  'setDpr',
  'setFrameloop',
  'events',
  'invalidate',
  'advance',
  'size',
  'viewport',
] as const;
type PrivateKeys = typeof privateKeys[number];

export interface NgtPortalInputs {
  container: ElementRef<THREE.Object3D> | THREE.Object3D;
  state: Partial<
    Omit<NgtState, PrivateKeys> & {
      events: Pick<NgtEventManager<any>, 'enabled' | 'priority' | 'compute' | 'connected'>;
      size: NgtSize;
    }
  >;
}

@Component({
  selector: 'ngt-portal[container]',
  standalone: true,
  template: '<ng-container #portalContentAnchor></ng-container>',
  providers: [provideNgtStore()],
})
export class NgtPortal implements OnInit, OnDestroy {
  private readonly inputsStore = create<NgtPortalInputs>(() => ({
    state: {},
    container: ref<THREE.Object3D>(),
  }));

  @Input() set container(container: NgtPortalInputs['container']) {
    this.inputsStore.setState({ container });
  }

  @Input() set state(state: NgtPortalInputs['state']) {
    this.inputsStore.setState({ state });
  }

  @ContentChild(TemplateRef, { static: true })
  portalContentTemplate!: TemplateRef<unknown>;

  @ViewChild('portalContentAnchor', { read: ViewContainerRef, static: true })
  portalContentAnchor!: ViewContainerRef;

  private readonly parentNgtStore = injectNgtStore({ skipSelf: true });
  private readonly portalNgtStore = injectNgtStore({ self: true });

  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();

  private subscription?: () => void;
  private portalContentView?: EmbeddedViewRef<unknown>;

  ngOnInit() {
    const previousState = this.parentNgtStore.store.getState();
    const inputsState = this.inputsStore.getState();

    const { events, size, ...restInputsState } = inputsState.state;

    const containerState = inputsState.container;
    const container = is.ref(containerState) ? containerState.nativeElement : containerState;

    this.portalNgtStore.store = create<NgtState>((set, get) => ({
      ...previousState,
      scene: container as Scene,
      raycaster: this.raycaster,
      pointer: this.pointer,
      previousStore: this.parentNgtStore.store,
      events: { ...previousState.events, ...(events || {}) },
      size: { ...previousState.size, ...(size || {}) },
      ...restInputsState,
      get,
      set,
      setEvents: (events) => set((state) => ({ ...state, events: { ...state.events, ...events } })),
    }));

    this.subscription = this.parentNgtStore.store.subscribe((previous) => {
      this.portalNgtStore.store.setState((state) => this.inject(previous, state));
    });

    requestAnimationFrame(() => {
      this.portalNgtStore.store.setState((injectState) =>
        this.inject(this.parentNgtStore.store.getState(), injectState)
      );
    });

    this.portalContentView = this.portalContentAnchor.createEmbeddedView(
      this.portalContentTemplate
    );
  }

  ngOnDestroy() {
    this.subscription?.();
    if (this.portalContentView && !this.portalContentView.destroyed) {
      this.portalContentView.destroy();
    }
  }

  private inject(rootState: NgtState, injectState: NgtState) {
    const intersect: Partial<NgtState> = { ...rootState };

    Object.keys(rootState).forEach((key) => {
      if (
        privateKeys.includes(key as PrivateKeys) ||
        rootState[key as keyof NgtState] !== injectState[key as keyof NgtState]
      ) {
        delete intersect[key as keyof NgtState];
      }
    });

    const inputs = this.inputsStore.getState();
    const { size, events, ...restInputsState } = inputs.state;

    let viewport = undefined;
    if (injectState && size) {
      const camera = injectState.camera;
      viewport = rootState.viewport.getCurrentViewport(camera, new Vector3(), size);
      if (camera !== rootState.camera) updateCamera(camera, size);
    }

    return {
      ...intersect,
      scene: is.ref(inputs.container) ? inputs.container.nativeElement : inputs.container,
      raycaster: this.raycaster,
      pointer: this.pointer,
      previousStore: this.parentNgtStore.store,
      events: { ...rootState.events, ...(injectState?.events || {}), ...events },
      size: { ...rootState.size, ...size },
      viewport: { ...rootState.viewport, ...(viewport || {}) },
      ...restInputsState,
    } as NgtState;
  }
}
