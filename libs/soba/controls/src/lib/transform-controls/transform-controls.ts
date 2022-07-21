import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  is,
  NgtObjectInputs,
  NgtObjectInputsState,
  NgtObjectPassThroughModule,
  NumberInput,
  provideObjectHostRef,
  Ref,
  startWithUndefined,
  tapEffect,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  NgModule,
  Output,
  TemplateRef,
} from '@angular/core';
import { animationFrameScheduler, observeOn, pipe, tap } from 'rxjs';
import * as THREE from 'three/src/Three';
import { TransformControls } from 'three-stdlib';

type ControlsProto = {
  enabled: boolean;
};

@Directive({
  selector: 'ng-template[ngt-soba-transform-controls-content]',
})
export class NgtSobaTransformControlsContent {
  constructor(public templateRef: TemplateRef<{ group: Ref<THREE.Group> }>) {}

  static ngTemplateContextGuard(dir: NgtSobaTransformControlsContent, ctx: any): ctx is { group: Ref<THREE.Group> } {
    return true;
  }
}

export interface NgtSobaTransformControlsState extends NgtObjectInputsState<TransformControls> {
  groupRef: Ref<THREE.Group>;

  object?: THREE.Object3D | Ref<THREE.Object3D>;
  camera?: THREE.Camera;

  enabled?: boolean;
  domElement?: HTMLElement;
  axis?: string | null;
  mode?: string;
  translationSnap?: number | null;
  rotationSnap?: number | null;
  scaleSnap?: number | null;
  space?: string;
  size?: number;
  showX?: boolean;
  showY?: boolean;
  showZ?: boolean;
}

@Component({
  selector: 'ngt-soba-transform-controls',
  template: `
    <ngt-group [ngtObjectOutputs]="this" [ngtObjectInputs]="this" [ref]="groupRef">
      <ng-container
        *ngIf="content"
        [ngTemplateOutlet]="content.templateRef"
        [ngTemplateOutletContext]="{ group: groupRef }"
      ></ng-container>
    </ngt-group>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaTransformControls, (controls) => controls.groupRef)],
})
export class NgtSobaTransformControls extends NgtObjectInputs<TransformControls, NgtSobaTransformControlsState> {
  @Input() set object(object: THREE.Object3D | Ref<THREE.Object3D>) {
    this.set({ object });
  }

  @Input() set camera(camera: THREE.Camera) {
    this.set({ camera });
  }

  @Input() set enabled(enabled: boolean) {
    this.set({ enabled });
  }

  @Input() set domElement(domElement: HTMLElement) {
    this.set({ domElement });
  }

  @Input() set axis(axis: string | null) {
    this.set({ axis });
  }

  @Input() set mode(mode: string) {
    this.set({ mode });
  }

  @Input() set translationSnap(translationSnap: NumberInput | null) {
    this.set({ translationSnap: coerceNumberProperty(translationSnap) });
  }

  @Input() set rotationSnap(rotationSnap: NumberInput | null) {
    this.set({ rotationSnap: coerceNumberProperty(rotationSnap) });
  }

  @Input() set scaleSnap(scaleSnap: NumberInput | null) {
    this.set({ scaleSnap: coerceNumberProperty(scaleSnap) });
  }

  @Input() set space(space: string) {
    this.set({ space });
  }

  @Input() set size(size: NumberInput) {
    this.set({ size: coerceNumberProperty(size) });
  }

  @Input() set showX(showX: BooleanInput) {
    this.set({ showX: coerceBooleanProperty(showX) });
  }

  @Input() set showY(showY: BooleanInput) {
    this.set({ showY: coerceBooleanProperty(showY) });
  }

  @Input() set showZ(showZ: BooleanInput) {
    this.set({ showZ: coerceBooleanProperty(showZ) });
  }

  @Output() change = new EventEmitter<THREE.Event>();
  @Output() mousedown = new EventEmitter<THREE.Event>();
  @Output() mouseup = new EventEmitter<THREE.Event>();
  @Output() objectChange = new EventEmitter<THREE.Event>();

  @ContentChild(NgtSobaTransformControlsContent)
  content?: NgtSobaTransformControlsContent;

  override shouldPassThroughRef = false;

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      groupRef: new Ref(),
      enabled: state.enabled ?? true,
      camera: state.camera ?? this.store.get((s) => s.camera),
      domElement:
        state.domElement ?? this.store.get((s) => s.events.connected) ?? this.store.get((s) => s.gl.domElement),
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.init(
          this.select(
            this.select((s) => s.camera),
            this.select((s) => s.domElement)
          )
        );
        this.attachObject(
          this.select(this.instance$, this.select((s) => s.object).pipe(startWithUndefined()), this.groupRef)
        );
        this.setDraggingEvent(
          this.select(
            this.instance$,
            this.store.select((s) => s.controls)
          )
        );
        this.setEvents(this.instance$);
      });
    });
  }

  private readonly init = this.effect<{}>(
    tap(() => {
      this.set((state) => ({
        camera: state.camera ?? this.store.get((s) => s.camera),
        domElement:
          state.domElement ?? this.store.get((s) => s.events.connected) ?? this.store.get((s) => s.gl.domElement),
      }));

      const { camera, domElement } = this.get();
      this.prepareInstance(new TransformControls(camera as THREE.Camera, domElement));
    })
  );

  private readonly attachObject = this.effect<{}>(
    pipe(
      observeOn(animationFrameScheduler),
      tapEffect(() => {
        const scene = this.store.get((s) => s.scene);
        const { groupRef, object } = this.get();
        if (object) {
          this.instance.value.attach(is.ref(object) ? object.value : object);
        } else if (groupRef.value) {
          this.instance.value.attach(groupRef.value);
        }

        if (!scene.children.some((child) => child.uuid === this.instance.value.uuid)) {
          scene.add(this.instance.value);
        }

        return ({ complete }) => {
          this.instance.value.detach();
          if (complete) {
            scene.remove(this.instance.value);
          }
        };
      })
    )
  );

  private readonly setDraggingEvent = this.effect<{}>(
    tapEffect(() => {
      const defaultControls = this.store.get((s) => s.controls) as unknown as ControlsProto;
      if (defaultControls) {
        const callback = (event: THREE.Event) => (defaultControls.enabled = !event['value']);
        this.instance.value.addEventListener('dragging-changed', callback);
        return () => this.instance.value.removeEventListener('dragging-changed', callback);
      }
      return;
    })
  );

  private readonly setEvents = this.effect<{}>(
    tapEffect(() => {
      const invalidate = this.store.get((s) => s.invalidate);
      const callback = (event: THREE.Event) => {
        invalidate();
        if (this.change.observed) {
          this.change.emit(event);
        }
      };

      this.instance.value?.addEventListener('change', callback);

      const boundMouseDown = this.mousedown.emit.bind(this.mousedown);
      const boundMouseUp = this.mouseup.emit.bind(this.mouseup);
      const boundObjectChange = this.objectChange.emit.bind(this.objectChange);

      if (this.mousedown.observed) {
        this.instance.value?.addEventListener('mouseDown', boundMouseDown);
      }

      if (this.mouseup.observed) {
        this.instance.value?.addEventListener('mouseUp', boundMouseUp);
      }

      if (this.objectChange.observed) {
        this.instance.value?.addEventListener('objectChange', boundObjectChange);
      }

      return () => {
        this.instance.value?.removeEventListener('change', callback);
        if (this.mousedown.observed) {
          this.instance.value?.removeEventListener('mouseDown', boundMouseDown);
        }

        if (this.mouseup.observed) {
          this.instance.value?.removeEventListener('mouseUp', boundMouseUp);
        }

        if (this.objectChange.observed) {
          this.instance.value?.removeEventListener('objectChange', boundObjectChange);
        }
      };
    })
  );

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      enabled: false,
      axis: true,
      mode: true,
      translationSnap: true,
      rotationSnap: true,
      scaleSnap: true,
      space: true,
      size: true,
      showX: true,
      showY: true,
      showZ: true,
    };
  }

  get groupRef() {
    return this.get((s) => s.groupRef);
  }
}

@NgModule({
  declarations: [NgtSobaTransformControls, NgtSobaTransformControlsContent],
  exports: [NgtSobaTransformControls, NgtSobaTransformControlsContent],
  imports: [NgtGroupModule, NgtObjectPassThroughModule, CommonModule],
})
export class NgtSobaTransformControlsModule {}
