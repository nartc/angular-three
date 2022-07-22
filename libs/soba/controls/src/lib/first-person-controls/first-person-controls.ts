import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtInstance,
  NgtInstanceState,
  NumberInput,
  provideInstanceRef,
  tapEffect,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { tap } from 'rxjs';
import { FirstPersonControls } from 'three-stdlib';

export interface NgtSobaFirstPersonControlsState extends NgtInstanceState<FirstPersonControls> {
  domElement?: HTMLElement;
}

@Component({
  selector: 'ngt-soba-first-person-controls',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtSobaFirstPersonControls)],
})
export class NgtSobaFirstPersonControls extends NgtInstance<FirstPersonControls, NgtSobaFirstPersonControlsState> {
  @Input() set domElement(domElement: HTMLElement) {
    this.set({ domElement });
  }

  @Input() set enabled(enabled: BooleanInput) {
    this.set({ enabled: coerceBooleanProperty(enabled) });
  }

  @Input() set movementSpeed(movementSpeed: NumberInput) {
    this.set({ movementSpeed: coerceNumberProperty(movementSpeed) });
  }

  @Input() set lookSpeed(lookSpeed: NumberInput) {
    this.set({ lookSpeed: coerceNumberProperty(lookSpeed) });
  }

  @Input() set lookVertical(lookVertical: BooleanInput) {
    this.set({ lookVertical: coerceBooleanProperty(lookVertical) });
  }

  @Input() set autoForward(autoForward: BooleanInput) {
    this.set({ autoForward: coerceBooleanProperty(autoForward) });
  }

  @Input() set activeLook(activeLook: BooleanInput) {
    this.set({ activeLook: coerceBooleanProperty(activeLook) });
  }

  @Input() set heightSpeed(heightSpeed: BooleanInput) {
    this.set({ heightSpeed: coerceBooleanProperty(heightSpeed) });
  }

  @Input() set heightCoef(heightCoef: NumberInput) {
    this.set({ heightCoef: coerceNumberProperty(heightCoef) });
  }

  @Input() set heightMin(heightMin: NumberInput) {
    this.set({ heightMin: coerceNumberProperty(heightMin) });
  }

  @Input() set heightMax(heightMax: NumberInput) {
    this.set({ heightMax: coerceNumberProperty(heightMax) });
  }

  @Input() set constrainVertical(constrainVertical: BooleanInput) {
    this.set({
      constrainVertical: coerceBooleanProperty(constrainVertical),
    });
  }

  @Input() set verticalMin(verticalMin: NumberInput) {
    this.set({ verticalMin: coerceNumberProperty(verticalMin) });
  }

  @Input() set verticalMax(verticalMax: NumberInput) {
    this.set({ verticalMax: coerceNumberProperty(verticalMax) });
  }

  @Input() set mouseDragOn(mouseDragOn: BooleanInput) {
    this.set({ mouseDragOn: coerceBooleanProperty(mouseDragOn) });
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      enabled: state['enabled'] ?? true,
      domElement:
        state.domElement ?? this.store.get((s) => s.events.connected) ?? this.store.get((s) => s.gl.domElement),
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.init(this.store.select((s) => s.camera));
        this.setBeforeRender(this.instance$);
      });
    });
  }

  private readonly init = this.effect(
    tap(() => {
      const camera = this.store.get((s) => s.camera);
      const domElement = this.get((s) => s.domElement);
      this.prepareInstance(new FirstPersonControls(camera, domElement));
    })
  );

  private readonly setBeforeRender = this.effect(
    tapEffect(() =>
      this.store.registerBeforeRender({
        priority: -1,
        callback: ({ delta }) => {
          if (this.instance.value.enabled) {
            this.instance.value.update(delta);
          }
        },
      })
    )
  );

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      enabled: false,
      movementSpeed: true,
      lookSpeed: true,
      lookVertical: true,
      autoForward: true,
      activeLook: true,
      heightSpeed: true,
      heightCoef: true,
      heightMin: true,
      heightMax: true,
      constrainVertical: true,
      verticalMin: true,
      verticalMax: true,
      mouseDragOn: true,
    };
  }
}

@NgModule({
  imports: [NgtSobaFirstPersonControls],
  exports: [NgtSobaFirstPersonControls],
})
export class NgtSobaFirstPersonControlsModule {}
