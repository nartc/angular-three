import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import type { Object3D } from 'three';
import { Color } from 'three';
import {
  AnimationStore,
  CanvasStore,
  EventsStore,
  InstancesStore,
} from '../stores';
import type {
  EventHandlers,
  InstanceInternal,
  ThreeColor,
  ThreeEuler,
  ThreeEvent,
  ThreeInstance,
  ThreeQuaternion,
  ThreeVector3,
  UnknownRecord,
} from '../typings';
import { applyProps } from '../utils';

@Directive()
export abstract class ThreeObject3d<TObject extends Object3D = Object3D>
  implements OnDestroy, OnChanges {
  @Input() name?: string;
  @Input() position?: ThreeVector3;
  @Input() rotation?: ThreeEuler;
  @Input() quaternion?: ThreeQuaternion;
  @Input() scale?: ThreeVector3;
  @Input() color?: ThreeColor;
  @Input() userData?: UnknownRecord;
  @Input() visible = true;
  @Input() matrixAutoUpdate = true;

  @Input() appendMode: 'immediate' | 'root' = 'immediate';
  @Input() appendTo?: Object3D;

  // events
  @Output() click = new EventEmitter<ThreeEvent<MouseEvent>>();
  @Output() contextmenu = new EventEmitter<ThreeEvent<MouseEvent>>();
  @Output() dblclick = new EventEmitter<ThreeEvent<MouseEvent>>();
  @Output() pointerup = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerdown = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerover = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerout = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerenter = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerleave = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointermove = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointermissed = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointercancel = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() wheel = new EventEmitter<ThreeEvent<WheelEvent>>();

  private $object3d = new BehaviorSubject<TObject | null>(null);

  get object3d$(): Observable<TObject | null> {
    return this.$object3d.asObservable();
  }

  @Output() ready = this.object3d$.pipe(filter(Boolean)) as Observable<TObject>;

  constructor(
    protected readonly canvasStore: CanvasStore,
    protected readonly animationStore: AnimationStore,
    protected readonly instancesStore: InstancesStore,
    protected readonly eventsStore: EventsStore,
    protected readonly ngZone: NgZone,
    @Optional()
    @SkipSelf()
    protected readonly parentObjectDirective?: ThreeObject3d
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.object3d) {
      this.applyCustomProps(changes);
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
    if (this.appendTo) {
      this.appendTo.remove(this.object3d);
    } else if (this.parentObjectDirective && this.appendMode === 'immediate') {
      this.parentObjectDirective.object3d.remove(this.object3d);
    } else {
      const { scene } = this.canvasStore.getImperativeState();
      if (scene) {
        scene.remove(this.object3d);
      }
    }
  }

  protected objectReady() {
    this.ngZone.run(() => {
      this.$object3d.next(this.object3d);
    });
  }

  private applyCustomProps(inputChanges?: SimpleChanges) {
    this.ngZone.runOutsideAngular(() => {
      const customProps = {
        visible: this.visible,
        matrixAutoUpdate: this.matrixAutoUpdate,
      } as UnknownRecord;

      if (this.name) {
        customProps['name'] = this.name;
      }

      if (this.position) {
        customProps['position'] = this.position;
      }

      if (this.rotation) {
        customProps['rotation'] = this.rotation;
      } else if (this.quaternion) {
        customProps['quaternion'] = this.quaternion;
      }

      if (this.scale) {
        customProps['scale'] = this.scale;
      }

      if (this.userData) {
        customProps['userData'] = this.userData;
      }

      if (this.color) {
        this.color = Array.isArray(this.color)
          ? new Color(...this.color)
          : new Color(this.color);
        if (!this.canvasStore.getImperativeState().isLinear) {
          this.color.convertSRGBToLinear();
        }
        customProps['color'] = this.color;
      }

      if (inputChanges) {
        for (const [inputName, inputChange] of Object.entries(inputChanges)) {
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
            ].includes(inputName) // skip 7 common inputs
          ) {
            continue;
          }
          customProps[inputName] = inputChange.currentValue;
        }
      }

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
      if (this[eventName].observers.length) {
        handlers[eventName] = (
          event: Parameters<
            Exclude<EventHandlers[typeof eventName], undefined>
          >[0]
        ) => {
          this.ngZone.run(() => {
            this[eventName].emit(event as ThreeEvent<any>);
          });
        };
      }
    });

    return handlers;
  }

  private appendToParent(): void {
    if (this.appendTo) {
      this.appendTo.add(this.object3d);
      return;
    }

    if (this.appendMode === 'root') {
      this.addToScene();
      return;
    }

    if (this.appendMode === 'immediate') {
      this.addToParent();
    }
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      this.remove();
      if (this.object3d) {
        this.instancesStore.removeObject(this.object3d.uuid);
        this.animationStore.unregisterAnimationEffect(this.object3d.uuid);
      }
    });
  }

  protected abstract initObject(): void;

  abstract get object3d(): TObject;
}
