import {
  Directive,
  Inject,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import type { Object3D } from 'three';
import { Color } from 'three';
import { Object3dControllerDirective } from '../controllers';
import { OBJECT_3D_WATCHED_CONTROLLER } from '../di';
import {
  AnimationStore,
  CanvasStore,
  EventsStore,
  InstancesStore,
} from '../stores';
import type {
  EventHandlers,
  InstanceInternal,
  ThreeEvent,
  ThreeInstance,
  UnknownRecord,
} from '../typings';
import { applyProps } from '../utils';
import { AnimationLoopParticipant } from './animation-loop-participant.abstract';

@Directive()
export abstract class ThreeObject3d<TObject extends Object3D = Object3D>
  extends AnimationLoopParticipant<TObject>
  implements OnDestroy, OnChanges {
  // @Input() name?: string;
  // @Input() position?: ThreeVector3;
  // @Input() rotation?: ThreeEuler;
  // @Input() quaternion?: ThreeQuaternion;
  // @Input() scale?: ThreeVector3;
  // @Input() color?: ThreeColor;
  // @Input() userData?: UnknownRecord;
  // @Input() castShadow = false;
  // @Input() receiveShadow = false;
  // @Input() visible = true;
  // @Input() matrixAutoUpdate = true;
  //
  // @Input() appendMode: 'immediate' | 'root' = 'immediate';
  // @Input() appendTo?: Object3D;
  //
  // // events
  // @Output() click = new EventEmitter<ThreeEvent<MouseEvent>>();
  // @Output() contextmenu = new EventEmitter<ThreeEvent<MouseEvent>>();
  // @Output() dblclick = new EventEmitter<ThreeEvent<MouseEvent>>();
  // @Output() pointerup = new EventEmitter<ThreeEvent<PointerEvent>>();
  // @Output() pointerdown = new EventEmitter<ThreeEvent<PointerEvent>>();
  // @Output() pointerover = new EventEmitter<ThreeEvent<PointerEvent>>();
  // @Output() pointerout = new EventEmitter<ThreeEvent<PointerEvent>>();
  // @Output() pointerenter = new EventEmitter<ThreeEvent<PointerEvent>>();
  // @Output() pointerleave = new EventEmitter<ThreeEvent<PointerEvent>>();
  // @Output() pointermove = new EventEmitter<ThreeEvent<PointerEvent>>();
  // @Output() pointermissed = new EventEmitter<ThreeEvent<PointerEvent>>();
  // @Output() pointercancel = new EventEmitter<ThreeEvent<PointerEvent>>();
  // @Output() wheel = new EventEmitter<ThreeEvent<WheelEvent>>();

  private $object3d = new BehaviorSubject<TObject | null>(null);

  get object3d$(): Observable<TObject | null> {
    return this.$object3d.asObservable();
  }

  @Output() ready = this.object3d$.pipe(filter(Boolean)) as Observable<TObject>;

  constructor(
    @Inject(OBJECT_3D_WATCHED_CONTROLLER)
    protected readonly object3dController: Object3dControllerDirective,
    protected readonly canvasStore: CanvasStore,
    protected readonly instancesStore: InstancesStore,
    protected readonly eventsStore: EventsStore,
    readonly animationStore: AnimationStore,
    readonly ngZone: NgZone,
    @Optional()
    @SkipSelf()
    protected readonly parentObjectDirective?: ThreeObject3d
  ) {
    super(animationStore, ngZone);
  }

  ngOnChanges(_: SimpleChanges) {
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
          } as InstanceInternal,
        });

        this.instancesStore.saveObject(
          (this.object3d as unknown) as ThreeInstance
        );

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
          ? new Color(...this.object3dController.color)
          : new Color(this.object3dController.color);
        if (!this.canvasStore.getImperativeState().isLinear) {
          this.object3dController.color.convertSRGBToLinear();
        }
        customProps['color'] = this.object3dController.color;
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
                'castShadow',
                'receiveShadow',
                'visible',
                'matrixAutoUpdate',
              ].includes(inputName) // skip 11 common inputs
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

  private applyEvents(): EventHandlers {
    const handlers: EventHandlers = {};

    ([
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
    ] as const).forEach((eventName) => {
      if (this.object3dController[eventName].observers.length) {
        handlers[eventName] = (
          event: Parameters<
            Exclude<EventHandlers[typeof eventName], undefined>
          >[0]
        ) => {
          this.ngZone.run(() => {
            this.object3dController[eventName].emit(event as ThreeEvent<any>);
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
