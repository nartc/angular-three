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
import { Subscription, take } from 'rxjs';
import * as THREE from 'three';
import {
  NgtEvent,
  NgtEventHandlers,
  NgtInstance,
  NgtInstanceInternal,
  UnknownRecord,
} from '../models';
import { NgtEventsStore } from '../stores/events.store';
import { NgtInstancesStore } from '../stores/instances.store';
import { NgtStore } from '../stores/store';
import { applyProps } from '../utils/apply-props';
import {
  NGT_ANIMATION_SUBSCRIBER_CONTROLLER_PROVIDER,
  NGT_ANIMATION_SUBSCRIBER_WATCHED_CONTROLLER,
  NgtAnimationSubscriberController,
} from './animation-subscriber.controller';
import { Controller, createControllerProviderFactory } from './controller';
import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObject3dInputsController,
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
    ngt-points,
    ngt-mesh,
    ngt-instanced-mesh
    ngt-skinned-mesh,
    ngt-audio,
    ngt-positional-audio,
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
  #object3dInputsController: NgtObject3dInputsController;

  #initFn?: () => THREE.Object3D;

  set initFn(v: () => THREE.Object3D) {
    this.#initFn = v;
  }

  get initFn() {
    if (!this.#initFn) {
      throw new Error('initFn needs to be set');
    }
    return this.#initFn as () => THREE.Object3D;
  }

  constructor(
    ngZone: NgZone,
    private store: NgtStore,
    private eventsStore: NgtEventsStore,
    private instancesStore: NgtInstancesStore,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    private objectInputsController: NgtObject3dInputsController,
    @Inject(NGT_ANIMATION_SUBSCRIBER_WATCHED_CONTROLLER)
    private animationSubscriberController: NgtAnimationSubscriberController,
    @Optional() @SkipSelf() private parentObject3d: NgtObject3dController | null
  ) {
    super(ngZone);

    this.#object3dInputsController =
      objectInputsController.object3dInputsController ?? objectInputsController;
  }

  ngOnInit() {
    super.ngOnInit();
    this.ngZone.runOutsideAngular(() => {
      this.#inputChangesSubscription =
        this.#object3dInputsController.change$.subscribe(() => {
          this.ngZone.runOutsideAngular(() => {
            if (this.object3d) {
              this.#applyCustomProps();
            }
          });
        });
    });
  }

  init() {
    this.ngZone.runOutsideAngular(() => {
      this.#object3d = this.initFn();
      if (this.object3d) {
        this.#applyCustomProps();

        const observedEvents = supportedEvents.reduce(
          (result, event) => {
            if (this.objectInputsController[event].observed) {
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
            stateGetter: () => this.store.getImperativeState(),
            eventsStateGetter: () => this.eventsStore.getImperativeState(),
            handlers: observedEvents.handlers,
            eventCount: observedEvents.eventCount,
            linear: this.store.getImperativeState().linear,
          } as NgtInstanceInternal,
        });

        // add as an interaction if there are events observed
        if (observedEvents.eventCount > 0) {
          this.eventsStore.addInteraction(this.object3d);
        }

        this.instancesStore.saveObject(this.object3d as unknown as NgtInstance);

        if (this.objectInputsController.appendMode !== 'none') {
          this.#appendToParent();
        }

        this.#objectReady();
      }
    });
  }

  #objectReady() {
    this.ready.emit();
    if (this.animationSubscriberController) {
      this.animationSubscriberController.subscribe(this.object3d);
    }
  }

  #appendToParent(): void {
    // Schedule this in the next loop to allow for all appendTo's to settle
    // TODO: find better way
    setTimeout(() => {
      if (this.objectInputsController.appendTo) {
        this.objectInputsController.appendTo.add(this.object3d);
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
    const { scene } = this.store.getImperativeState();
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
      this.objectInputsController.appendTo.remove(this.object3d);
    } else if (
      this.parentObject3d &&
      this.objectInputsController.appendMode === 'immediate'
    ) {
      this.parentObject3d.object3d.remove(this.object3d);
    } else {
      const { scene } = this.store.getImperativeState();
      if (scene) {
        scene.remove(this.object3d);
      }
    }

    this.object3d.clear();
  }

  #eventNameToHandler(eventName: typeof supportedEvents[number]) {
    return (
      event: Parameters<
        Exclude<NgtEventHandlers[typeof eventName], undefined>
      >[0]
    ) => {
      this.ngZone.run(() => {
        this.objectInputsController[eventName].emit(event as NgtEvent<any>);
      });
    };
  }

  #applyCustomProps() {
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
        if (!this.store.getImperativeState().linear) {
          (customProps['color'] as THREE.Color).convertSRGBToLinear();
        }
      }

      if (this.objectInputsController.dispose) {
        customProps['dispose'] = this.objectInputsController.dispose;
      }

      this.objectInputsController.change$.pipe(take(1)).subscribe((changes) => {
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
      this.object3d.updateMatrix();
    });
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.#inputChangesSubscription) {
        this.#inputChangesSubscription.unsubscribe();
      }

      if (this.object3d) {
        this.#remove();
        this.instancesStore.removeObject(this.object3d.uuid);
        this.eventsStore.removeInteraction(this.object3d.uuid);
      }
    });
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
  exports: [NgtObject3dController],
})
export class NgtObject3dControllerModule {}

export const [NGT_OBJECT_WATCHED_CONTROLLER, NGT_OBJECT_CONTROLLER_PROVIDER] =
  createControllerProviderFactory({
    watchedControllerTokenName: 'Watched Object3dController',
    controller: NgtObject3dController,
  });
