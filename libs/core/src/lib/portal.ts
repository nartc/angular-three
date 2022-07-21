import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Inject,
  Input,
  NgModule,
  NgZone,
  Optional,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three/src/Three';
import { NgtInstance, NgtInstanceState } from './abstracts/instance';
import { Ref } from './ref';
import { NgtResize, NgtResizeResult } from './services/resize';
import { tapEffect } from './stores/component-store';
import { NgtStore } from './stores/store';
import { NGT_CAMERA_REF, NGT_INSTANCE_HOST_REF, NGT_INSTANCE_REF, NGT_OBJECT_REF, NGT_SCENE_REF } from './tokens';
import type { AnyFunction, NgtEventManager, NgtSize, NgtState } from './types';
import { updateCamera } from './utils/camera';
import { prepare } from './utils/instance';
import { makeDpr } from './utils/make';

export const privateKeys = ['events', 'invalidate', 'advance', 'size', 'viewport'] as const;

@Directive({
  selector: 'ng-template[ngt-portal-content]',
  standalone: true,
})
export class NgtPortalContent {
  constructor(public templateRef: TemplateRef<{ portal: Ref<THREE.Scene> }>) {}

  static ngTemplateContextGuard(dir: NgtPortalContent, ctx: any): ctx is { portal: Ref<THREE.Scene> } {
    return true;
  }
}

export interface NgtPortalState extends NgtInstanceState<THREE.Scene> {
  size: NgtSize;
  events: Pick<NgtEventManager, 'enabled' | 'priority' | 'compute' | 'connected'>;

  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;

  portalStore: NgtStore;
}

@Component({
  selector: 'ngt-portal',
  standalone: true,
  template: `
    <ng-container
      *ngIf="content"
      [ngTemplateOutlet]="content.templateRef"
      [ngTemplateOutletContext]="{ portal: instance }"
    ></ng-container>
    <ng-content></ng-content>
  `,
  imports: [NgIf, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NgtResize,
    {
      provide: NgtStore,
      useFactory: (portal: NgtPortal) => {
        return portal.get((s) => s.portalStore);
      },
      deps: [NgtPortal],
    },
    {
      provide: NGT_INSTANCE_REF,
      useFactory: (portal: NgtPortal) => {
        return () => portal.get((s) => s.portalStore).get((s) => s.sceneRef);
      },
      deps: [NgtPortal],
    },
    {
      provide: NGT_OBJECT_REF,
      useFactory: (portal: NgtPortal) => {
        return () => portal.get((s) => s.portalStore).get((s) => s.sceneRef);
      },
      deps: [NgtPortal],
    },
    {
      provide: NGT_SCENE_REF,
      useFactory: (portal: NgtPortal) => {
        return () => portal.get((s) => s.portalStore).get((s) => s.sceneRef);
      },
      deps: [NgtPortal],
    },
    {
      provide: NGT_CAMERA_REF,
      useFactory: (portal: NgtPortal) => {
        return () => portal.get((s) => s.portalStore).get((s) => s.cameraRef);
      },
      deps: [NgtPortal],
    },
  ],
})
export class NgtPortal extends NgtInstance<THREE.Scene, NgtPortalState> {
  @Input() set size(size: NgtSize) {
    this.set({ size });
  }

  @Input() set events(events: Pick<NgtEventManager, 'enabled' | 'priority' | 'compute' | 'connected'>) {
    this.set({ events });
  }

  @ContentChild(NgtPortalContent) content?: NgtPortalContent;

  constructor(
    zone: NgZone,
    @SkipSelf()
    store: NgtStore,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_REF)
    parentRef: AnyFunction<Ref>,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_HOST_REF)
    parentHostRef: AnyFunction<Ref>,
    @Inject(NgtResize) private resizeResult$: Observable<NgtResizeResult>
  ) {
    super(zone, store, parentRef, parentHostRef);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.zone.runOutsideAngular(() => {
      // portal initialization does not need to wait for canvas ready
      this.init();
      this.onCanvasReady(this.store.ready$, () => {
        // init portal store
        this.initPortalStore();
        this.subscribeToRoot();
        this.setInitialPortalState();
      });
    });
  }

  private readonly init = this.effect<void>(
    tap(() => {
      const previousState = this.store.get();
      this.set((state) => ({
        raycaster: new THREE.Raycaster(),
        pointer: new THREE.Vector2(),
        size: state.size ?? previousState.size,
        events: state.events ?? previousState.events,
      }));
    })
  );

  private readonly initPortalStore = this.effect<void>(
    tap(() => {
      const previousState = this.store.get();
      const portalState = this.get();

      const clientDimensions = {
        clientWidth: portalState.size.width,
        clientHeight: portalState.size.height,
      };

      const { regress: _, ...performanceOptions } = previousState.performance;

      const portalStore = new NgtStore(
        { nativeElement: clientDimensions as HTMLElement },
        performanceOptions,
        {
          devicePixelRatio: makeDpr(previousState.viewport.dpr),
        } as Window,
        this.store,
        this.resizeResult$,
        this.zone
      );

      const sceneRef = this.instance;

      let scene = this.instance.value;

      if (!scene) {
        scene = prepare(new THREE.Scene(), () => portalStore.get(), this.parentRef?.());
        this.instance.set(scene);
      }

      portalStore.set({
        ...previousState,
        scene,
        sceneRef,
        raycaster: portalState.raycaster,
        pointer: portalState.pointer,
        mouse: portalState.pointer,
        previousState: this.store.get(),
        events: { ...previousState.events, ...portalState.events },
        size: { ...previousState.size, ...portalState.size },
      });

      this.set({ portalStore });
    })
  );

  private readonly subscribeToRoot = this.effect<void>(
    tapEffect(() => {
      const unsub = this.store.select().subscribe((root) => {
        this.get((s) => s.portalStore).set((portal) => this.inject(root, portal));
      });

      return () => {
        unsub.unsubscribe();
      };
    })
  );

  private readonly setInitialPortalState = this.effect<void>(
    tap(() => {
      this.get((s) => s.portalStore).set((portal) => this.inject(this.store.get(), portal));
    })
  );

  private inject(root: NgtState, injected: NgtState): Partial<NgtState> {
    const { size, events, portalStore } = this.get();

    const {
      scene,
      raycaster,
      pointer,
      previousState,
      events: portalStoreEvents,
      size: portalStoreSize,
      viewport: portalStoreViewport,
      mouse,
      ...rest
    } = portalStore.get();

    const intersect: Partial<NgtState> = { ...root };

    Object.keys(root).forEach((key) => {
      if (
        privateKeys.includes(key as typeof privateKeys[number]) ||
        root[key as keyof NgtState] !== injected[key as keyof NgtState]
      ) {
        delete intersect[key as keyof NgtState];
      }
    });

    let viewport = undefined;
    if (injected && size) {
      const camera = injected.camera;
      viewport = root.viewport.getCurrentViewport(camera, new THREE.Vector3(), size);
      if (camera !== root.camera) {
        updateCamera(root.cameraOptions, camera, size);
      }
    }

    return {
      ...intersect,
      scene,
      raycaster,
      pointer,
      mouse,
      previousState,
      events: {
        ...root.events,
        ...(injected?.events || portalStoreEvents),
        ...events,
      },
      size: { ...root.size, ...portalStoreSize, ...size },
      viewport: {
        ...root.viewport,
        ...(viewport || portalStoreViewport),
      },
      ...rest,
    };
  }
}

@NgModule({
  imports: [NgtPortal, NgtPortalContent],
  exports: [NgtPortal, NgtPortalContent],
})
export class NgtPortalModule {}
