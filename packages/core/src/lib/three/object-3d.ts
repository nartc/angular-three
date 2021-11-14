import {
  Directive,
  Inject,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { BehaviorSubject, filter, Observable, Subscription, take } from 'rxjs';
import * as THREE from 'three';
import type {
  NgtEvent,
  NgtEventHandlers,
  NgtInstance,
  NgtInstanceInternal,
  UnknownRecord,
} from '../models';
import { AnimationStore } from '../stores/animation.store';
import { CanvasStore } from '../stores/canvas.store';
import { EventsStore } from '../stores/events.store';
import { InstancesStore } from '../stores/instances.store';
import { applyProps } from '../utils/apply-props.util';
import { NgtAnimationLoopParticipant } from './animation-participant';
import { NGT_OBJECT_3D_WATCHED_CONTROLLER } from './object-3d-watched-controller.di';
import { NgtObject3dControllerDirective } from './object-3d.controller';

@Directive()
export abstract class NgtObject3d<
    TObject extends THREE.Object3D = THREE.Object3D
  >
  extends NgtAnimationLoopParticipant<TObject>
  implements OnDestroy, OnChanges
{
  private $object3d = new BehaviorSubject<TObject | null>(null);
  readonly object3d$ = this.$object3d.asObservable();

  @Output() ready = this.object3d$.pipe(filter(Boolean)) as Observable<TObject>;

  private readonly changesSubscription?: Subscription;

  protected constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    protected object3dController: NgtObject3dControllerDirective,
    protected canvasStore: CanvasStore,
    protected instancesStore: InstancesStore,
    protected eventsStore: EventsStore,
    animationStore: AnimationStore,
    ngZone: NgZone,
    @Optional()
    @SkipSelf()
    protected parentObjectDirective?: NgtObject3d
  ) {
    super(animationStore, ngZone);

    this.changesSubscription = object3dController.change$.subscribe(() => {
      if (this.object3d) {
        this.applyCustomProps();
      }
      if (this.inputChangeHandler) {
        this.inputChangeHandler();
      }
    });
  }

  ngOnChanges() {
    if (this.object3d) {
      this.applyCustomProps();
    }
  }

  protected init() {
    this.ngZone.runOutsideAngular(() => {
      this.initObject();

      if (this.object3d) {
        this.applyCustomProps();

        applyProps(this.object3d, {
          __ngt: {
            canvasStateGetter: () => this.canvasStore.getImperativeState(),
            eventsStateGetter: () => this.eventsStore.getImperativeState(),
            handlers: this.applyEvents(),
          } as NgtInstanceInternal,
        });

        this.instancesStore.saveObject(this.object3d as unknown as NgtInstance);

        this.appendToParent();
        this.objectReady();
      }
    });
  }

  protected addToScene() {
    const { scene } = this.canvasStore.getImperativeState();
    if (scene) {
      scene.add(this.object3d);
    }
  }

  protected addToParent() {
    if (this.parentObjectDirective) {
      this.parentObjectDirective.object3d.add(this.object3d);
    } else {
      this.addToScene();
    }
  }

  protected remove() {
    if (this.object3dController.appendTo) {
      this.object3dController.appendTo.remove(this.object3d);
    } else if (
      this.parentObjectDirective &&
      this.object3dController.appendMode === 'immediate'
    ) {
      this.parentObjectDirective.object3d.remove(this.object3d);
    } else {
      const { scene } = this.canvasStore.getImperativeState();
      if (scene) {
        scene.remove(this.object3d);
      }
    }

    this.object3d.clear();
  }

  protected objectReady() {
    this.$object3d.next(this.object3d);
    this.participate(this.object3d);
  }

  protected inputChangeHandler?: () => void;

  private applyCustomProps() {
    this.ngZone.runOutsideAngular(() => {
      const customProps = {
        castShadow: this.object3dController.castShadow,
        receiveShadow: this.object3dController.receiveShadow,
        visible: this.object3dController.visible,
        matrixAutoUpdate: this.object3dController.matrixAutoUpdate,
      } as UnknownRecord;

      if (this.object3dController.name) {
        customProps['name'] = this.object3dController.name;
      }

      if (this.object3dController.position) {
        customProps['position'] = this.object3dController.position;
      }

      if (this.object3dController.rotation) {
        customProps['rotation'] = this.object3dController.rotation;
      } else if (this.object3dController.quaternion) {
        customProps['quaternion'] = this.object3dController.quaternion;
      }

      if (this.object3dController.scale) {
        customProps['scale'] = this.object3dController.scale;
      }

      if (this.object3dController.userData) {
        customProps['userData'] = this.object3dController.userData;
      }

      if (this.object3dController.color) {
        this.object3dController.color = Array.isArray(
          this.object3dController.color
        )
          ? new THREE.Color(...this.object3dController.color)
          : new THREE.Color(this.object3dController.color);
        if (!this.canvasStore.getImperativeState().isLinear) {
          this.object3dController.color.convertSRGBToLinear();
        }
        customProps['color'] = this.object3dController.color;
      }

      if (this.object3dController.dispose) {
        customProps['dispose'] = this.object3dController.dispose;
      }

      this.object3dController.change$.pipe(take(1)).subscribe((changes) => {
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
              ].includes(inputName) // skip 12 common inputs
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

  private applyEvents(): NgtEventHandlers {
    const handlers: NgtEventHandlers = {};

    (
      [
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
      ] as const
    ).forEach((eventName) => {
      if (this.object3dController[eventName].observed) {
        handlers[eventName] = (
          event: Parameters<
            Exclude<NgtEventHandlers[typeof eventName], undefined>
          >[0]
        ) => {
          this.ngZone.run(() => {
            this.object3dController[eventName].emit(event as NgtEvent<any>);
          });
        };
      }
    });

    return handlers;
  }

  private appendToParent(): void {
    if (this.object3dController.appendTo) {
      this.object3dController.appendTo.add(this.object3d);
      return;
    }

    if (this.object3dController.appendMode === 'root') {
      this.addToScene();
      return;
    }

    if (this.object3dController.appendMode === 'immediate') {
      this.addToParent();
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
    this.ngZone.runOutsideAngular(() => {
      if (this.object3d) {
        this.remove();
        this.instancesStore.removeObject(this.object3d.uuid);
        this.animationStore.unregisterAnimationEffect(this.object3d.uuid);
      }
    });
  }

  protected abstract initObject(): void;

  abstract get object3d(): TObject;
}
