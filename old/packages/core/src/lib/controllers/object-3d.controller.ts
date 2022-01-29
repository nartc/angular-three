// GENERATED
import {
  Directive,
  EventEmitter,
  Inject,
  NgModule,
  NgZone,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
import { BehaviorSubject, defer, map, merge, Subscription, take } from 'rxjs';
import * as THREE from 'three';
import { NgtEventsStore } from '../stores/events.store';
import { NgtStore } from '../stores/store';
import {
  NgtEvent,
  NgtEventHandlers,
  NgtInstanceInternal,
  UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import {
  NGT_ANIMATION_SUBSCRIBER_CONTROLLER_PROVIDER,
  NGT_ANIMATION_SUBSCRIBER_WATCHED_CONTROLLER,
  NgtAnimationSubscriberController,
  NgtAnimationSubscriberControllerModule,
} from './animation-subscriber.controller';
import { Controller, createControllerProviderFactory } from './controller';
import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
} from './object-3d-inputs.controller';

const supportedEvents = [
  'click',
  'contextmenu',
  'dblclick',
  'pointerup',
  'pointerdown',
  'pointerover',
  'pointerout',
  'pointerenter',
  'pointerleave',
  'pointermove',
  'pointermissed',
  'pointercancel',
  'wheel',
] as const;

@Directive({
  selector: `
    ngt-primitive,
    ngt-bone,
    ngt-group,
    ngt-lod,
    ngt-points,
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
    ngt-audio,
    ngt-positional-audio,
    ngt-line,
    ngt-line-loop,
    ngt-line-segments,
    ngt-light-probe,
    ngt-ambient-light,
    ngt-ambient-light-probe,
    ngt-hemisphere-light,
    ngt-hemisphere-light-probe,
    ngt-directional-light,
    ngt-point-light,
    ngt-spot-light,
    ngt-rect-area-light,
    ngt-arrow-helper,
    ngt-axes-helper,
    ngt-box3-helper,
    ngt-grid-helper,
    ngt-plane-helper,
    ngt-polar-grid-helper,
    ngt-sprite,
    ngt-camera,
    ngt-perspective-camera,
    ngt-orthographic-camera,
    ngt-array-camera,
    ngt-stereo-camera,
    ngt-cube-camera
  `,
  exportAs: 'ngtObject3dController',
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_ANIMATION_SUBSCRIBER_CONTROLLER_PROVIDER,
  ],
})
export class NgtObject3dController extends Controller implements OnDestroy {
  #object3d = new BehaviorSubject<THREE.Object3D | null>(null);
  readonly object3d$ = this.#object3d.asObservable();

  #inputChangesSubscription?: Subscription;

  #initFn?: () => THREE.Object3D;

  set initFn(v: () => THREE.Object3D) {
    this.#initFn = v;
  }

  get initFn() {
    if (!this.#initFn) {
      this.initFn = () => this.object3d;
    }
    return this.#initFn as () => THREE.Object3D;
  }

  #change$ = defer(() => {
    if (this.objectInputsController.object3dInputsController) {
      return merge(
        this.objectInputsController.change$.pipe(
          map((changes) => ({
            changes,
            controller: this.objectInputsController,
          }))
        ),
        this.objectInputsController.object3dInputsController.change$.pipe(
          map((changes) => ({
            changes,
            controller: this.objectInputsController.object3dInputsController!,
          }))
        )
      );
    }
    return this.objectInputsController.change$.pipe(
      map((changes) => ({
        changes,
        controller: this.objectInputsController,
      }))
    );
  }).pipe(
    map(({ changes, controller }) => {
      return Object.keys(changes).reduce((trueChanges, key) => {
        trueChanges[key] = controller[key as keyof NgtObject3dInputsController];
        return trueChanges;
      }, {} as UnknownRecord);
    })
  );

  constructor(
    ngZone: NgZone,
    private store: NgtStore,
    private eventsStore: NgtEventsStore,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    private objectInputsController: NgtObject3dInputsController,
    @Inject(NGT_ANIMATION_SUBSCRIBER_WATCHED_CONTROLLER)
    private animationSubscriberController: NgtAnimationSubscriberController,
    @Optional() @SkipSelf() private parentObject3d: NgtObject3dController
  ) {
    super(ngZone);
  }

  ngOnInit() {
    super.ngOnInit();
    this.#inputChangesSubscription = this.#change$.subscribe((changes) => {
      if (this.object3d) {
        this.#applyCustomProps(changes);
      }
    });
  }

  init() {
    this.ngZone.runOutsideAngular(() => {
      if (this.object3d) {
        this.#switch();
      } else {
        this.#object3d.next(this.initFn());
      }
      if (this.object3d) {
        this.#applyCustomProps();

        if (!this.disabled) {
          const observedEvents = supportedEvents.reduce(
            (result, event) => {
              const controllerEvent = this.objectInputsController[event]
                .observed
                ? this.objectInputsController[event]
                : this.objectInputsController.object3dInputsController?.[event]
                    .observed
                ? this.objectInputsController.object3dInputsController[event]
                : null;
              if (controllerEvent) {
                result.handlers[event] = this.#eventNameToHandler(
                  controllerEvent as EventEmitter<NgtEvent<any>>
                );
                result.eventCount += 1;
              }
              return result;
            },
            { handlers: {}, eventCount: 0 } as {
              handlers: NgtEventHandlers;
              eventCount: number;
            }
          );

          // setup __ngt instance
          applyProps(this.object3d, {
            __ngt: {
              stateGetter: () => this.store.get(),
              eventsStateGetter: () => this.eventsStore.get(),
              handlers: observedEvents.handlers,
              eventCount: observedEvents.eventCount,
              linear: this.store.get('linear'),
            } as NgtInstanceInternal,
          });

          // add as an interaction if there are events observed
          if (observedEvents.eventCount > 0) {
            this.eventsStore.addInteraction(this.object3d);
          }

          this.store.set((state) => ({
            ...state,
            objects: { ...state.objects, [this.object3d.uuid]: this.object3d },
          }));

          if (this.objectInputsController.appendMode !== 'none') {
            this.#appendToParent();
          }
        }

        this.#objectReady();
      }
    });
  }

  #objectReady() {
    if (this.readyFn) {
      this.readyFn();
    }
    if (this.animationSubscriberController) {
      this.animationSubscriberController.prepare(this.object3d);
    }
  }

  #appendToParent(): void {
    // Schedule this in the next frame to allow for all appendTo's to settle
    requestAnimationFrame(() => {
      if (this.objectInputsController.appendTo) {
        this.#appendTo.add(this.object3d);
        return;
      }

      if (this.objectInputsController.appendMode === 'root') {
        this.#addToScene();
        return;
      }

      if (this.objectInputsController.appendMode === 'immediate') {
        this.#addToParent();
      }
    });
  }

  #addToScene() {
    const scene = this.store.get('scene');
    if (scene) {
      scene.add(this.object3d);
    }
  }

  #addToParent() {
    if (this.parentObject3d) {
      this.parentObject3d.object3d.add(this.object3d);
    } else {
      this.#addToScene();
    }
  }

  #remove() {
    if (this.objectInputsController.appendTo) {
      this.#appendTo.remove(this.object3d);
    } else if (
      this.parentObject3d &&
      this.objectInputsController.appendMode === 'immediate'
    ) {
      this.parentObject3d.object3d.remove(this.object3d);
    } else {
      const scene = this.store.get('scene');
      if (scene) {
        scene.remove(this.object3d);
      }
    }
  }

  #switch() {
    const newObject3d = this.initFn();
    if (this.object3d.children) {
      this.object3d.traverse((object) => {
        if (object !== this.object3d && object.parent === this.object3d) {
          object.parent = newObject3d;
        }
      });
      this.object3d.children = [];
    }

    this.#remove();
    this.store.set((state) => {
      const { [this.object3d.uuid]: _, ...objects } = state.objects;
      return { ...state, objects };
    });
    this.eventsStore.removeInteraction(this.object3d.uuid);
    this.#object3d.next(newObject3d);
    console.log(this.store.get('scene'));
  }

  #eventNameToHandler(
    controllerEvent:
      | EventEmitter<NgtEvent<PointerEvent>>
      | EventEmitter<NgtEvent<WheelEvent>>
  ) {
    return (
      event: Parameters<
        Exclude<NgtEventHandlers[typeof supportedEvents[number]], undefined>
      >[0]
    ) => {
      this.ngZone.run(() => {
        controllerEvent.emit(event as NgtEvent<any>);
      });
    };
  }

  #applyCustomProps(changes?: UnknownRecord) {
    this.ngZone.runOutsideAngular(() => {
      const customProps = {
        castShadow: this.objectInputsController.castShadow,
        receiveShadow: this.objectInputsController.receiveShadow,
        visible: this.objectInputsController.visible,
        matrixAutoUpdate: this.objectInputsController.matrixAutoUpdate,
      } as UnknownRecord;

      if (this.objectInputsController.name) {
        customProps['name'] = this.objectInputsController.name;
      }

      if (this.objectInputsController.position) {
        customProps['position'] = this.objectInputsController.position;
      }

      if (this.objectInputsController.rotation) {
        customProps['rotation'] = this.objectInputsController.rotation;
      } else if (this.objectInputsController.quaternion) {
        customProps['quaternion'] = this.objectInputsController.quaternion;
      }

      if (this.objectInputsController.scale) {
        customProps['scale'] = this.objectInputsController.scale;
      }

      if (this.objectInputsController.userData) {
        customProps['userData'] = this.objectInputsController.userData;
      }

      if (this.objectInputsController.color) {
        customProps['color'] = this.objectInputsController.color;
        if (!this.store.get('linear')) {
          (customProps['color'] as THREE.Color).convertSRGBToLinear();
        }
      }

      if (this.objectInputsController.dispose) {
        customProps['dispose'] = this.objectInputsController.dispose;
      }

      if (this.objectInputsController.raycast) {
        customProps['raycast'] = this.objectInputsController.raycast;
      }

      if (changes) {
        Object.assign(customProps, changes);
      }

      this.#change$.pipe(take(1)).subscribe((changes) => {
        if (changes && Object.keys(changes).length) {
          for (const [inputName, inputChange] of Object.entries(changes)) {
            if (
              [
                'name',
                'position',
                'rotation',
                'quaternion',
                'scale',
                'userData',
                'color',
                'dispose',
                'raycast',
                'castShadow',
                'receiveShadow',
                'visible',
                'matrixAutoUpdate',
                'object3dController',
              ].includes(inputName) // skip 14 common inputs
            ) {
              continue;
            }
            customProps[inputName] = inputChange;
          }
        }
      });

      applyProps(this.object3d, customProps);
      this.object3d.updateMatrix?.();
    });
  }

  ngOnDestroy() {
    if (this.#inputChangesSubscription) {
      this.#inputChangesSubscription.unsubscribe();
    }

    if (this.object3d) {
      this.#remove();
      if (this.object3d.clear) {
        this.object3d.clear();
      }
      this.store.set((state) => {
        const { [this.object3d.uuid]: _, ...objects } = state.objects;
        return { ...state, objects };
      });
      this.eventsStore.removeInteraction(this.object3d.uuid);
    }
  }

  get object3d(): THREE.Object3D {
    return this.#object3d.getValue() as THREE.Object3D;
  }

  get #appendTo() {
    return this.objectInputsController.appendTo instanceof THREE.Object3D
      ? this.objectInputsController.appendTo
      : (this.objectInputsController.appendTo as () => THREE.Object3D)();
  }

  get controller(): Controller | undefined {
    return undefined;
  }

  get props(): string[] {
    return [];
  }
}

@NgModule({
  declarations: [NgtObject3dController],
  exports: [
    NgtObject3dController,
    NgtObject3dInputsControllerModule,
    NgtAnimationSubscriberControllerModule,
  ],
})
export class NgtObject3dControllerModule {}

export const [NGT_OBJECT_WATCHED_CONTROLLER, NGT_OBJECT_CONTROLLER_PROVIDER] =
  createControllerProviderFactory({
    watchedControllerTokenName: 'Watched Object3dController',
    controller: NgtObject3dController,
  });