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
import { RxState } from '@rx-angular/state';
import { Raycaster, Scene, Vector2, Vector3 } from 'three';
import { injectNgtStore, NgtStore } from './store';
import type { NgtEventManager, NgtSize, NgtState } from './types';
import { updateCamera } from './utils/camera';
import { is } from './utils/is';

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
  providers: [NgtStore],
})
export class NgtPortal extends RxState<NgtPortalInputs> implements OnInit, OnDestroy {
  @Input() set container(container: NgtPortalInputs['container']) {
    this.set({ container });
  }

  @Input() set state(state: NgtPortalInputs['state']) {
    this.set({ state });
  }

  @ContentChild(TemplateRef, { static: true })
  portalContentTemplate!: TemplateRef<unknown>;

  @ViewChild('portalContentAnchor', { read: ViewContainerRef, static: true })
  portalContentAnchor!: ViewContainerRef;

  private readonly parentStore = injectNgtStore({ skipSelf: true });
  private readonly portalStore = injectNgtStore({ self: true });

  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();

  private portalContentView?: EmbeddedViewRef<unknown>;

  ngOnInit() {
    const previousState = this.parentStore.get();
    const inputsState = this.get();

    const { events, size, ...restInputsState } = inputsState.state;

    const containerState = inputsState.container;
    const container = is.ref(containerState) ? containerState.nativeElement : containerState;

    this.portalStore.set({
      ...previousState,
      scene: container as Scene,
      raycaster: this.raycaster,
      pointer: this.pointer,
      previousStore: this.parentStore,
      events: { ...previousState.events, ...(events || {}) },
      size: { ...previousState.size, ...(size || {}) },
      ...restInputsState,
      get: this.portalStore.get.bind(this.portalStore),
      set: this.portalStore.set.bind(this.portalStore),
      select: this.portalStore.select.bind(this.portalStore),
      setEvents: (events) =>
        this.portalStore.set((state) => ({ ...state, events: { ...state.events, ...events } })),
    });

    this.hold(this.parentStore.select(), (previous) =>
      this.portalStore.set((state) => this.inject(previous, state))
    );

    requestAnimationFrame(() => {
      this.portalStore.set((injectState) => this.inject(this.parentStore.get(), injectState));
    });

    this.portalContentView = this.portalContentAnchor.createEmbeddedView(
      this.portalContentTemplate
    );
    this.portalContentView.detectChanges();
  }

  override ngOnDestroy() {
    if (this.portalContentView && !this.portalContentView.destroyed) {
      this.portalContentView.destroy();
    }
    super.ngOnDestroy();
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

    const inputs = this.get();
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
      previousStore: this.parentStore,
      events: { ...rootState.events, ...(injectState?.events || {}), ...events },
      size: { ...rootState.size, ...size },
      viewport: { ...rootState.viewport, ...(viewport || {}) },
      ...restInputsState,
    } as NgtState;
  }
}
