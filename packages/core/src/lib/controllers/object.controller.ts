// GENERATED
import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import * as THREE from 'three';
import { NgtAnimationFrameStore } from '../stores/animation-frame';
import { NgtCanvasStore } from '../stores/canvas';
import { NgtEventsStore } from '../stores/events';
import type {
  NgtEvent,
  NgtEventHandlers,
  NgtInstanceInternal,
  NgtRender,
  UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { zonelessRequestAnimationFrame } from '../utils/zoneless-timer';
import { Controller, createControllerProviderFactory } from './controller';
import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
} from './object-inputs.controller';

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
  exportAs: 'ngtObjectController',
  providers: [NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER],
})
export class NgtObjectController extends Controller implements OnDestroy {
  @Input() priority = 0;
  @Output() animateReady = new EventEmitter<{
    state: NgtRender;
    object: THREE.Object3D;
  }>();

  private readonly $object = new BehaviorSubject<THREE.Object3D | null>(null);

  get object(): THREE.Object3D {
    return this.$object.getValue() as THREE.Object3D;
  }

  private inputChangesSubscription?: Subscription;

  private _initFn?: () => THREE.Object3D;

  set initFn(v: () => THREE.Object3D) {
    this._initFn = v;
  }

  get initFn() {
    if (!this._initFn) {
      this.initFn = () => this.object;
    }
    return this._initFn as () => THREE.Object3D;
  }

  constructor(
    zone: NgZone,
    private canvasStore: NgtCanvasStore,
    private eventsStore: NgtEventsStore,
    private animationFrameStore: NgtAnimationFrameStore,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    private objectInputsController: NgtObjectInputsController,
    @Optional() @SkipSelf() private parentObject: NgtObjectController
  ) {
    super(zone);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.inputChangesSubscription = this.changes$.subscribe((changes) => {
      if (this.object) {
        this.applyCustomProps(changes);
      }
    });
  }

  /**
   * zoneless
   */
  init() {
    zonelessRequestAnimationFrame(() => {
      if (this.object) {
        this.switch();
      } else {
        this.$object.next(this.initFn());
      }

      if (this.object) {
        this.applyCustomProps();
        if (!this.disabled) {
          const observedEvents = supportedEvents.reduce(
            (result, event) => {
              const controllerEvent = this.objectInputsController[event]
                .observed
                ? this.objectInputsController[event]
                : this.objectInputsController.objectInputsController?.[event]
                    .observed
                ? this.objectInputsController.objectInputsController[event]
                : null;
              if (controllerEvent) {
                result.handlers[event] = this.eventNameToHandler(
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
          applyProps(this.object, {
            __ngt: {
              stateGetter: this.canvasStore.get.bind(this.canvasStore),
              eventsStateGetter: this.eventsStore.get.bind(this.eventsStore),
              handlers: observedEvents.handlers,
              eventCount: observedEvents.eventCount,
              linear: this.canvasStore.get('linear'),
            } as NgtInstanceInternal,
          });

          // add as an interaction if there are events observed
          if (observedEvents.eventCount > 0) {
            this.eventsStore.addInteraction(this.object);
          }

          this.canvasStore.set((state) => ({
            ...state,
            objects: { ...state.objects, [this.object.uuid]: this.object },
          }));

          if (this.objectInputsController.appendMode !== 'none') {
            this.appendToParent();
          }
        }

        if (this.readyFn) {
          this.readyFn();
        }
      }

      if (this.animateReady.observed) {
        this.animationFrameStore.register({
          obj: () => this.object,
          callback: (state) => {
            this.animateReady.emit({ state, object: this.object });
          },
          priority: this.priority,
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.inputChangesSubscription) {
      this.inputChangesSubscription.unsubscribe();
    }

    if (this.object) {
      this.animationFrameStore.actions.unregister(this.object.uuid);
      this.remove();
      if (this.object.clear) {
        this.object.clear();
      }

      this.canvasStore.set((state) => {
        const { [this.object.uuid]: _, ...objects } = state.objects;
        return { ...state, objects };
      });
      this.eventsStore.removeInteraction(this.object.uuid);
    }
  }

  private appendToParent(): void {
    // Schedule this in the next frame to allow for all appendTo's to settle
    this.zone.runOutsideAngular(() => {
      if (this.objectInputsController.appendTo) {
        this.appendTo.add(this.object);
        return;
      }

      if (this.objectInputsController.appendMode === 'root') {
        this.addToScene();
        return;
      }

      if (this.objectInputsController.appendMode === 'immediate') {
        this.addToParent();
      }
    });
  }

  private addToScene() {
    const scene = this.canvasStore.get('scene');
    if (scene) {
      scene.add(this.object);
    }
  }

  private addToParent() {
    if (this.parentObject) {
      this.parentObject.object.add(this.object);
    } else {
      this.addToScene();
    }
  }

  private eventNameToHandler(
    controllerEvent:
      | EventEmitter<NgtEvent<PointerEvent>>
      | EventEmitter<NgtEvent<WheelEvent>>
  ) {
    return (
      event: Parameters<
        Exclude<NgtEventHandlers[typeof supportedEvents[number]], undefined>
      >[0]
    ) => {
      this.zone.run(() => {
        controllerEvent.emit(event as NgtEvent<any>);
      });
    };
  }

  private switch() {
    const newObject3d = this.initFn();
    if (this.object.children) {
      this.object.traverse((object) => {
        if (object !== this.object && object.parent === this.object) {
          object.parent = newObject3d;
        }
      });
      this.object.children = [];
    }

    this.remove();
    this.canvasStore.set((state) => {
      const { [this.object.uuid]: _, ...objects } = state.objects;
      return { ...state, objects };
    });
    this.eventsStore.removeInteraction(this.object.uuid);
    this.$object.next(newObject3d);
  }

  private remove() {
    if (this.objectInputsController.appendTo) {
      this.appendTo.remove(this.object);
    } else if (
      this.parentObject &&
      this.objectInputsController.appendMode === 'immediate'
    ) {
      this.parentObject.object.remove(this.object);
    } else {
      const scene = this.canvasStore.get('scene');
      if (scene) {
        scene.remove(this.object);
      }
    }
  }

  private get appendTo() {
    return this.objectInputsController.appendTo instanceof THREE.Object3D
      ? this.objectInputsController.appendTo
      : (this.objectInputsController.appendTo as () => THREE.Object3D)();
  }

  private applyCustomProps(simpleChanges?: SimpleChanges) {
    this.zone.runOutsideAngular(() => {
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
        if (!this.canvasStore.get('linear')) {
          (customProps['color'] as THREE.Color).convertSRGBToLinear();
        }
      }

      if (this.objectInputsController.dispose) {
        customProps['dispose'] = this.objectInputsController.dispose;
      }

      if (this.objectInputsController.raycast) {
        customProps['raycast'] = this.objectInputsController.raycast;
      }

      if (simpleChanges) {
        Object.assign(customProps, simpleChanges);
      }

      this.changes$.pipe(take(1)).subscribe((changes) => {
        if (changes && Object.keys(changes).length) {
          for (const [inputName, inputChange] of Object.entries(changes)) {
            // TODO: double check this
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
                'objectController',
              ].includes(inputName) // skip 14 common inputs
            ) {
              continue;
            }
            customProps[inputName] = inputChange;
          }
        }
      });

      applyProps(this.object, customProps);
      this.object.updateMatrix?.();
    });
  }
}

@NgModule({
  declarations: [NgtObjectController],
  exports: [NgtObjectController, NgtObjectInputsControllerModule],
})
export class NgtObjectControllerModule {}

export const [NGT_OBJECT_WATCHED_CONTROLLER, NGT_OBJECT_CONTROLLER_PROVIDER] =
  createControllerProviderFactory({
    watchedControllerTokenName: 'Watched ObjectController',
    controller: NgtObjectController,
  });
