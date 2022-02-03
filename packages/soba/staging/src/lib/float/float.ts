import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtExtender,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtRender,
  NgtStore,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Inject,
  Input,
  NgModule,
  TemplateRef,
} from '@angular/core';
import * as THREE from 'three';

export interface NgtSobaFloatState {
  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
  innerGroup: THREE.Group;
  outerGroup: THREE.Group;
}

@Directive({
  selector: 'ng-template[sobaFloatContent]',
  exportAs: 'ngtSobaFloatContent',
})
export class NgtSobaFloatContent {
  constructor(public templateRef: TemplateRef<NgtSobaFloatState>) {}
}

@Component({
  selector: 'ngt-soba-float',
  template: `
    <ngt-group
      (ready)="store.set({ outerGroup: $event })"
      [objectInputsController]="objectInputsController"
    >
      <ngt-group
        (ready)="object = $event; store.set({ innerGroup: $event })"
        (animateReady)="onInnerGroupAnimate($event.state)"
      >
        <ng-container
          *ngIf="object"
          [ngTemplateOutlet]="content.templateRef"
          [ngTemplateOutletContext]="store.get()"
        ></ng-container>
      </ngt-group>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NgtStore,
    {
      provide: NgtExtender,
      useExisting: NgtSobaFloat,
    },
  ],
})
export class NgtSobaFloat extends NgtExtender<THREE.Group> {
  @Input() set speed(speed: number) {
    this.store.set({ speed });
  }

  @Input() set rotationIntensity(rotationIntensity: number) {
    this.store.set({ rotationIntensity });
  }

  @Input() set floatIntensity(floatIntensity: number) {
    this.store.set({ floatIntensity });
  }

  @ContentChild(NgtSobaFloatContent, { static: true })
  content!: NgtSobaFloatContent;

  private offset = Math.random() * 10000;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController,
    public store: NgtStore<NgtSobaFloatState>
  ) {
    super();
    store.set({
      speed: 1,
      rotationIntensity: 1,
      floatIntensity: 1,
    });
  }

  onInnerGroupAnimate(state: NgtRender) {
    if (this.object) {
      const { speed, rotationIntensity, floatIntensity } = this.store.get();
      const t = this.offset + state.clock.getElapsedTime();
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
  declarations: [NgtSobaFloat, NgtSobaFloatContent],
  exports: [NgtSobaFloat, NgtSobaFloatContent, NgtObjectInputsControllerModule],
  imports: [NgtGroupModule, CommonModule],
})
export class NgtSobaFloatModule {}
