// GENERATED
import {
  Directive,
  EventEmitter,
  Inject,
  NgModule,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { setTimeout } from '@rx-angular/cdk/zone-less';
import { Subscription, take } from 'rxjs';
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
  @Output() ready = new EventEmitter<void>();

  #object3d?: THREE.Object3D;
  #inputChangesSubscription?: Subscription;
  #object3dInputsController!: NgtObject3dInputsController;

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
    this.#object3dInputsController =
      this.objectInputsController.object3dInputsController ??
      this.objectInputsController;
    super.ngOnInit();
    this.#inputChangesSubscription =
      this.#object3dInputsController.change$.subscribe(() => {
        if (this.object3d) {
          this.#applyCustomProps();
        }
      });
  }

  init() {
    this.ngZone.runOutsideAngular(() => {
      this.#object3d = this.initFn();
      if (this.object3d) {
        this.#object3dInputsController =
          this.objectInputsController.object3dInputsController ??
          this.objectInputsController;

        this.#applyCustomProps();

        if (!this.disabled) {
          const observedEvents = supportedEvents.reduce(
            (result, event) => {
              if (this.#object3dInputsController[event].observed) {
                result.handlers[event] = this.#eventNameToHandler(event);
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

          if (this.#object3dInputsController.appendMode !== 'none') {
            this.#appendToParent();
          }
        }

        this.#objectReady();
      }
    });
  }

  #objectReady() {
    this.ready.emit();
    if (this.animationSubscriberController) {
      this.animationSubscriberController.prepare(this.object3d);
    }
  }

  #appendToParent(): void {
    // Schedule this in the next loop to allow for all appendTo's to settle
    // TODO: find better way
    setTimeout(() => {
      if (this.#object3dInputsController.appendTo) {
        this.#object3dInputsController.appendTo.add(this.object3d);
        return;
      }

      if (this.#object3dInputsController.appendMode === 'root') {
        this.#addToScene();
        return;
      }

      if (this.#object3dInputsController.appendMode === 'immediate') {
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
    if (this.#object3dInputsController.appendTo) {
      this.#object3dInputsController.appendTo.remove(this.object3d);
    } else if (
      this.parentObject3d &&
      this.#object3dInputsController.appendMode === 'immediate'
    ) {
      this.parentObject3d.object3d.remove(this.object3d);
    } else {
      const scene = this.store.get('scene');
      if (scene) {
        scene.remove(this.object3d);
      }
    }

    if (this.object3d.clear) {
      this.object3d.clear();
    }
  }

  #eventNameToHandler(eventName: typeof supportedEvents[number]) {
    return (
      event: Parameters<
        Exclude<NgtEventHandlers[typeof eventName], undefined>
      >[0]
    ) => {
      this.ngZone.run(() => {
        this.#object3dInputsController[eventName].emit(event as NgtEvent<any>);
      });
    };
  }

  #applyCustomProps() {
    this.ngZone.runOutsideAngular(() => {
      const customProps = {
        castShadow: this.#object3dInputsController.castShadow,
        receiveShadow: this.#object3dInputsController.receiveShadow,
        visible: this.#object3dInputsController.visible,
        matrixAutoUpdate: this.#object3dInputsController.matrixAutoUpdate,
      } as UnknownRecord;

      if (this.#object3dInputsController.name) {
        customProps['name'] = this.#object3dInputsController.name;
      }

      if (this.#object3dInputsController.position) {
        customProps['position'] = this.#object3dInputsController.position;
      }

      if (this.#object3dInputsController.rotation) {
        customProps['rotation'] = this.#object3dInputsController.rotation;
      } else if (this.#object3dInputsController.quaternion) {
        customProps['quaternion'] = this.#object3dInputsController.quaternion;
      }

      if (this.#object3dInputsController.scale) {
        customProps['scale'] = this.#object3dInputsController.scale;
      }

      if (this.#object3dInputsController.userData) {
        customProps['userData'] = this.#object3dInputsController.userData;
      }

      if (this.#object3dInputsController.color) {
        customProps['color'] = this.#object3dInputsController.color;
        if (!this.store.get('linear')) {
          (customProps['color'] as THREE.Color).convertSRGBToLinear();
        }
      }

      if (this.#object3dInputsController.dispose) {
        customProps['dispose'] = this.#object3dInputsController.dispose;
      }

      if (this.#object3dInputsController.raycast) {
        customProps['raycast'] = this.#object3dInputsController.raycast;
      }

      this.#object3dInputsController.change$
        .pipe(take(1))
        .subscribe((changes) => {
          if (changes) {
            for (const [inputName, inputChange] of Object.entries(changes)) {
              if (
                !inputChange.isFirstChange() ||
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
              customProps[inputName] = inputChange.currentValue;
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
      this.store.set((state) => {
        const { [this.object3d.uuid]: _, ...objects } = state.objects;
        return { ...state, objects };
      });
      this.eventsStore.removeInteraction(this.object3d.uuid);
    }
  }

  get object3d(): THREE.Object3D {
    return this.#object3d as THREE.Object3D;
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
