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
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { tap } from 'rxjs';
import { FlyControls } from 'three-stdlib';

export interface NgtSobaFlyControlsState extends NgtInstanceState<FlyControls> {
  domElement?: HTMLElement;
}

@Component({
  selector: 'ngt-soba-fly-controls',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtSobaFlyControls)],
})
export class NgtSobaFlyControls extends NgtInstance<FlyControls, NgtSobaFlyControlsState> {
  @Input() set domElement(domElement: HTMLElement) {
    this.set({ domElement });
  }

  @Input() set movementSpeed(movementSpeed: NumberInput) {
    this.set({ movementSpeed: coerceNumberProperty(movementSpeed) });
  }

  @Input() set rollSpeed(rollSpeed: NumberInput) {
    this.set({ rollSpeed: coerceNumberProperty(rollSpeed) });
  }

  @Input() set dragToLook(dragToLook: BooleanInput) {
    this.set({ dragToLook: coerceBooleanProperty(dragToLook) });
  }

  @Input() set autoForward(autoForward: BooleanInput) {
    this.set({ autoForward: coerceBooleanProperty(autoForward) });
  }

  @Output() change = new EventEmitter<THREE.Event>();

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      domElement:
        state.domElement ?? this.store.get((s) => s.events.connected) ?? this.store.get((s) => s.gl.domElement),
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.init(this.store.select((s) => s.camera));
        this.setup(this.instance$);
      });
    });
  }

  private readonly init = this.effect<{}>(
    tap(() => {
      const camera = this.store.get((s) => s.camera);
      const domElement = this.get((s) => s.domElement) as HTMLElement;
      this.prepareInstance(new FlyControls(camera, domElement));
    })
  );

  private readonly setup = this.effect<{}>(
    tapEffect(() => {
      const unregister = this.store.registerBeforeRender({
        callback: ({ delta }) => {
          this.instance.value?.update(delta);
        },
      });

      const callback = (event: THREE.Event) => {
        const invalidate = this.store.get((s) => s.invalidate);
        invalidate();
        if (this.change.observed) {
          this.change.emit(event);
        }
      };

      this.instance.value?.addEventListener('change', callback);

      return () => {
        unregister();
        this.instance.value?.removeEventListener('change', callback);
      };
    })
  );

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      movementSpeed: true,
      rollSpeed: true,
      dragToLook: true,
      autoForward: true,
    };
  }
}

@NgModule({
  imports: [NgtSobaFlyControls],
  exports: [NgtSobaFlyControls],
})
export class NgtSobaFlyControlsModule {}
