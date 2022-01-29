import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtRender,
  NgtSobaExtender,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Input,
  NgModule,
  QueryList,
} from '@angular/core';
import { startWith } from 'rxjs';
import * as THREE from 'three';

export interface NgtSobaFloatState {
  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
}

@Component({
  selector: 'ngt-soba-float',
  template: `
    <ngt-group [object3dInputsController]="objectInputsController">
      <ngt-group
        (ready)="object = $event"
        (animateReady)="onInnerGroupAnimate($event)"
      >
        <ng-content></ng-content>
      </ngt-group>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    EnhancedRxState,
    {
      provide: NgtSobaExtender,
      useExisting: NgtSobaFloat,
    },
  ],
})
export class NgtSobaFloat extends NgtSobaExtender<THREE.Group> {
  @Input() set speed(speed: number) {
    this.state.set({ speed });
  }

  @Input() set rotationIntensity(rotationIntensity: number) {
    this.state.set({ rotationIntensity });
  }

  @Input() set floatIntensity(floatIntensity: number) {
    this.state.set({ floatIntensity });
  }

  @ContentChildren(NgtObject3dInputsController) set children(
    v: QueryList<NgtObject3dInputsController>
  ) {
    this.state.hold(
      v.changes.pipe(startWith(v)),
      (controllers: QueryList<NgtObject3dInputsController>) => {
        controllers.forEach((controller) => {
          controller.appendTo = () => this.object;
        });
      }
    );
  }

  #offset = Math.random() * 10000;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    private state: EnhancedRxState<NgtSobaFloatState>
  ) {
    super();
    state.set({
      speed: 1,
      rotationIntensity: 1,
      floatIntensity: 1,
    });
  }

  onInnerGroupAnimate(state: NgtRender) {
    if (this.object) {
      const { speed, rotationIntensity, floatIntensity } = this.state.get();
      const t = this.#offset + state.clock.getElapsedTime();
      this.object.rotation.x =
        (Math.cos((t / 4) * speed) / 8) * rotationIntensity;
      this.object.rotation.y =
        (Math.sin((t / 4) * speed) / 8) * rotationIntensity;
      this.object.rotation.z =
        (Math.sin((t / 4) * speed) / 20) * rotationIntensity;
      this.object.position.y =
        (Math.sin((t / 4) * speed) / 10) * floatIntensity;

      this.animateReady.emit({ entity: this.object, state });
    }
  }
}

@NgModule({
  declarations: [NgtSobaFloat],
  exports: [NgtSobaFloat, NgtObject3dInputsControllerModule],
  imports: [NgtGroupModule],
})
export class NgtSobaFloatModule {}
