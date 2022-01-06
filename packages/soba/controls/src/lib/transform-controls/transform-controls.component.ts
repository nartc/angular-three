import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtLoopService,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtStore,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { combineLatest, map, merge } from 'rxjs';
import * as THREE from 'three';
import { TransformControls } from 'three-stdlib';

type ControlsProto = {
  enabled: boolean;
};

interface NgtSobaTransformControlsState {
  controls: TransformControls;
  enabled: boolean;
  object: THREE.Object3D;
  group: THREE.Group;
  camera: THREE.Camera | null;
}

@Component({
  selector: 'ngt-soba-transform-controls',
  template: `
    <ngt-primitive *ngIf="controls" [object]="controls"></ngt-primitive>
    <ngt-group
      *ngIf="!object"
      (ready)="set({ group: $event })"
      [object3dInputsController]="objectInputsController"
    >
      <ng-content></ng-content>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER],
})
export class NgtSobaTransformControls
  extends EnhancedRxState<NgtSobaTransformControlsState>
  implements OnInit
{
  @Input() set enabled(enabled: boolean) {
    this.set({ enabled });
  }

  @Input() set object(object: THREE.Object3D) {
    this.set({ object });
  }

  @Input() set camera(camera: THREE.Camera) {
    this.set({ camera });
  }

  readonly #attach$ = combineLatest([
    this.select('controls'),
    merge(this.select('object'), this.select('group')),
  ]);

  @Output() ready = this.#attach$;
  @Output() change = new EventEmitter<THREE.Event>();
  @Output() mousedown = new EventEmitter<THREE.Event>();
  @Output() mouseup = new EventEmitter<THREE.Event>();
  @Output() objectChange = new EventEmitter<THREE.Event>();

  readonly #initControls$ = combineLatest([
    this.store.select('ready'),
    this.select('camera'),
  ]).pipe(map(([ready, camera]) => ({ ready, camera })));

  readonly #draggingChanged$ = combineLatest([
    this.store.select('controls'),
    this.select('controls'),
  ]).pipe(
    map(([defaultControls, controls]) => ({
      defaultControls: defaultControls as unknown as ControlsProto,
      controls,
    }))
  );

  @ContentChildren(NgtObject3dInputsController, { descendants: true }) set test(
    controllers: QueryList<NgtObject3dInputsController>
  ) {
    controllers.forEach((controller) => {
      controller.appendTo = () => this.group;
    });
  }

  constructor(
    private store: NgtStore,
    private loopService: NgtLoopService,
    private ngZone: NgZone,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController
  ) {
    super();
    this.set({
      enabled: true,
      camera: null,
    });
  }

  get object() {
    return this.get('object');
  }

  get group() {
    return this.get('group');
  }

  get controls() {
    return this.get('controls');
  }

  ngOnInit() {
    this.hold(this.#attach$, ([controls, object]) => {
      controls.attach(object);
    });

    this.hold(this.#initControls$, ({ camera, ready }) => {
      if (ready) {
        this.ngZone.runOutsideAngular(() => {
          const controlsCamera: THREE.Camera =
            camera || this.store.get('camera');
          this.set({
            controls: new TransformControls(
              controlsCamera,
              this.store.get('renderer').domElement
            ),
          });
        });
      }
    });

    this.holdEffect(this.#draggingChanged$, ({ defaultControls, controls }) => {
      return this.ngZone.runOutsideAngular(() => {
        if (defaultControls) {
          const callback = (event: THREE.Event) =>
            (defaultControls.enabled = !event.value);
          controls.addEventListener('dragging-changed', callback);
          return () =>
            controls.removeEventListener('dragging-changed', callback);
        }
        return;
      });
    });

    this.holdEffect(this.select('controls'), (controls) => {
      return this.ngZone.runOutsideAngular(() => {
        const callback = (e: THREE.Event) => {
          this.loopService.invalidate();
          if (this.change.observed) this.change.emit(e);
        };

        controls.addEventListener('change', callback);

        const onMouseDown: ((event: THREE.Event) => void) | undefined = this
          .mousedown.observed
          ? this.mousedown.emit.bind(this.mousedown)
          : undefined;
        const onMouseUp: ((event: THREE.Event) => void) | undefined = this
          .mouseup.observed
          ? this.mouseup.emit.bind(this.mouseup)
          : undefined;
        const onObjectChange: ((event: THREE.Event) => void) | undefined = this
          .objectChange.observed
          ? this.objectChange.emit.bind(this.objectChange)
          : undefined;

        if (onMouseDown) controls.addEventListener('mouseDown', onMouseDown);
        if (onMouseUp) controls.addEventListener('mouseUp', onMouseUp);
        if (onObjectChange)
          controls.addEventListener('objectChange', onObjectChange);

        return () => {
          controls.removeEventListener('change', callback);
          if (onMouseDown)
            controls.removeEventListener('mouseDown', onMouseDown);
          if (onMouseUp) controls.removeEventListener('mouseUp', onMouseUp);
          if (onObjectChange)
            controls.removeEventListener('objectChange', onObjectChange);
        };
      });
    });
  }
}

@NgModule({
  declarations: [NgtSobaTransformControls],
  exports: [NgtSobaTransformControls, NgtObject3dInputsControllerModule],
  imports: [NgtGroupModule, NgtPrimitiveModule, CommonModule],
})
export class NgtSobaTransformControlsModule {}
