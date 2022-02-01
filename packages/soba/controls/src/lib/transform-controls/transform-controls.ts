import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtCanvasStore,
  NgtLoop,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtStore,
  zonelessRequestAnimationFrame,
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
      [objectInputsController]="objectInputsController"
    >
      <ng-content></ng-content>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER],
})
export class NgtSobaTransformControls
  extends NgtStore<NgtSobaTransformControlsState>
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

  private attach$ = combineLatest([
    this.select('controls'),
    merge(this.select('object'), this.select('group')),
  ]);

  @Output() ready = this.attach$;
  @Output() change = new EventEmitter<THREE.Event>();
  @Output() mousedown = new EventEmitter<THREE.Event>();
  @Output() mouseup = new EventEmitter<THREE.Event>();
  @Output() objectChange = new EventEmitter<THREE.Event>();

  private initControls$ = combineLatest([
    this.canvasStore.select('ready'),
    this.select('camera'),
  ]).pipe(map(([ready, camera]) => ({ ready, camera })));

  private draggingChanged$ = combineLatest([
    this.canvasStore.select('controls'),
    this.select('controls'),
  ]).pipe(
    map(([defaultControls, controls]) => ({
      defaultControls: defaultControls as unknown as ControlsProto,
      controls,
    }))
  );

  @ContentChildren(NgtObjectInputsController, { descendants: true })
  set children(controllers: QueryList<NgtObjectInputsController>) {
    controllers.forEach((controller) => {
      controller.appendTo = () => this.group;
    });
  }

  constructor(
    private canvasStore: NgtCanvasStore,
    private loop: NgtLoop,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController
  ) {
    super();
    this.set({ enabled: true, camera: null });
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
    zonelessRequestAnimationFrame(() => {
      this.hold(this.attach$, ([controls, object]) => {
        controls.attach(object);
      });

      this.hold(this.initControls$, ({ camera, ready }) => {
        if (ready) {
          const controlsCamera: THREE.Camera =
            camera || this.canvasStore.get('camera');
          this.set({
            controls: new TransformControls(
              controlsCamera,
              this.canvasStore.get('renderer').domElement
            ),
          });
        }
      });

      this.effect(this.draggingChanged$, ({ defaultControls, controls }) => {
        if (defaultControls) {
          const callback = (event: THREE.Event) =>
            (defaultControls.enabled = !event['value']);
          controls.addEventListener('dragging-changed', callback);
          return () =>
            controls.removeEventListener('dragging-changed', callback);
        }
        return;
      });

      this.effect(this.select('controls'), (controls) => {
        const callback = (e: THREE.Event) => {
          this.loop.invalidate();
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
  exports: [NgtSobaTransformControls, NgtObjectInputsControllerModule],
  imports: [NgtGroupModule, NgtPrimitiveModule, CommonModule],
})
export class NgtSobaTransformControlsModule {}
