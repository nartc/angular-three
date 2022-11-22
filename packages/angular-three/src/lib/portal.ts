import { Component, inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
import { NgtRef } from './ref';
import { NgtComponentStore, tapEffect } from './stores/component-store';
import { is } from './utils/is';
import { prepare } from './utils/instance';
import { updateCamera } from './utils/camera';
import { provideInstanceRef } from './instance';
import type { NgtEventManager, NgtSize, NgtState } from './types';
import { NgtStore } from './stores/store';

const privateKeys = [
    'setSize',
    'setCamera',
    'setDpr',
    'setFrameloop',
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
    providers: [NgtStore, provideInstanceRef(NgtPortal, (portal) => portal.containerRef)],
})
export class NgtPortal extends NgtComponentStore<NgtPortalState> implements OnInit, OnDestroy {
    @Input() set container(container: NgtRef<THREE.Object3D> | THREE.Object3D) {
        this.write({ container: is.ref(container) ? container : new NgtRef(container) });
    }

    @Input() set size(size: NgtPortalState['size']) {
        this.write({ size });
    }

    @Input() set events(events: NgtPortalState['events']) {
        this.write({ events });
    }

    @Input() set state(state: NgtPortalState['state']) {
        this.write({ state });
    }

    private readonly zone = inject(NgZone);
    private readonly portalStore = inject(NgtStore, { self: true });
    private readonly parentStore = inject(NgtStore, { skipSelf: true });

    private readonly raycaster = new THREE.Raycaster();
    private readonly pointer = new THREE.Vector2();

    get containerRef() {
        return this.portalStore.read((s) => s.sceneRef);
    }

    private readonly subscribeToParentStore = this.effect<void>(
        tapEffect(() => {
            const sub = this.parentStore.state$.subscribe((parentState) => {
                this.portalStore.write((portalState) => this.inject(parentState, portalState));
            });
            return () => sub.unsubscribe();
        })
    );

    override initialize() {
        super.initialize();
        this.write({
            state: {},
            container: new NgtRef(),
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            // init the portal store with previous (parent) state
            this.initPortalStore();
            // subscribe to parent store to inject parent state
            this.subscribeToParentStore();
            // set initial portal state
            this.setInitialPortalState();
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

    private initPortalStore() {
        const parentState = this.parentStore.read();
        const portalState = this.read();
        const containerRef = portalState.container;
        let container = containerRef.value;

        if (!container) {
            container = prepare(
                new THREE.Scene(),
                this.portalStore.read,
                this.portalStore.rootStateFactory,
                this.parentStore.read((s) => s.sceneRef)
            );
            containerRef.set(container);
        }

        this.portalStore.write({
            ...parentState,
            scene: container,
            sceneRef: containerRef,
            raycaster: this.raycaster,
            pointer: this.pointer,
            previousStateFactory: this.parentStore.read,
            events: { ...parentState.events, ...(portalState.events || {}) },
            size: { ...parentState.size, ...(portalState.size || {}) },
            ...portalState.state,
        });
    }

    private setInitialPortalState() {
        this.portalStore.write((portalState) => this.inject(this.parentStore.read(), portalState));
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

        const state = this.read();
        let viewport = undefined;

        if (portalState && state.size) {
            const camera = portalState.camera;
            // calculate viewport
            viewport = parentState.viewport.getCurrentViewport(camera, new THREE.Vector3(), state.size);
            // update camera
            if (camera !== parentState.camera) {
                updateCamera(camera, state.size);
            }
        }

        return {
            ...intersect,
            scene: state.container.value as THREE.Scene,
            sceneRef: state.container as unknown as NgtRef,
            raycaster: this.raycaster,
            pointer: this.pointer,
            previousStateFactory: this.parentStore.read,
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
