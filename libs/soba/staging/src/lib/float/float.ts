import {
  AnyFunction,
  coerceNumberProperty,
  NGT_OBJECT_REF,
  NgtObjectInputs,
  NgtObjectInputsState,
  NgtObjectPassThrough,
  NumberInput,
  provideObjectHostRef,
  Ref,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/group';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  Input,
  NgModule,
  QueryList,
  TemplateRef,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ng-template[ngt-soba-float-content]',
  standalone: true,
})
export class NgtSobaFloatContent {
  constructor(public templateRef: TemplateRef<{ group: Ref<THREE.Group> }>) {}

  static ngTemplateContextGuard(dir: NgtSobaFloatContent, ctx: any): ctx is { group: Ref<THREE.Group> } {
    return true;
  }
}

export interface NgtSobaFloatState extends NgtObjectInputsState<THREE.Group> {
  innerGroup: Ref<THREE.Group>;

  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
}

@Component({
  selector: 'ngt-soba-float',
  standalone: true,
  template: `
    <ngt-group skipParent [ngtObjectInputs]="this" [ngtObjectOutputs]="this">
      <ngt-group [ref]="innerGroup">
        <ng-container
          *ngIf="content"
          [ngTemplateOutlet]="content.templateRef"
          [ngTemplateOutletContext]="{ group: innerGroup }"
        ></ng-container>
      </ngt-group>
    </ngt-group>
    <ng-content></ng-content>
  `,
  imports: [NgtGroup, NgtObjectPassThrough, NgIf, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaFloat, (float) => float.innerGroup)],
})
export class NgtSobaFloat extends NgtObjectInputs<THREE.Group, NgtSobaFloatState> {
  @Input() set speed(speed: NumberInput) {
    this.set({ speed: coerceNumberProperty(speed) });
  }

  @Input() set rotationIntensity(rotationIntensity: NumberInput) {
    this.set({
      rotationIntensity: coerceNumberProperty(rotationIntensity),
    });
  }

  @Input() set floatIntensity(floatIntensity: NumberInput) {
    this.set({ floatIntensity: coerceNumberProperty(floatIntensity) });
  }

  @ContentChild(NgtSobaFloatContent) content?: NgtSobaFloatContent;
  @ContentChildren(NGT_OBJECT_REF) children!: QueryList<AnyFunction>;

  private readonly offset = Math.random() * 10000;

  get innerGroup() {
    return this.get((s) => s.innerGroup);
  }

  protected override preInit(): void {
    super.preInit();
    this.set((state) => ({
      innerGroup: new Ref(),
      speed: state.speed ?? 1,
      rotationIntensity: state.rotationIntensity ?? 1,
      floatIntensity: state.floatIntensity ?? 1,
    }));
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() =>
        this.store.registerBeforeRender({
          callback: ({ clock }) => {
            const { speed, rotationIntensity, floatIntensity } = this.get();
            const t = this.offset + clock.getElapsedTime();

            if (this.instance.value) {
              this.instance.value.rotation.x = (Math.cos((t / 4) * speed) / 8) * rotationIntensity;
              this.instance.value.rotation.y = (Math.sin((t / 4) * speed) / 8) * rotationIntensity;
              this.instance.value.rotation.z = (Math.sin((t / 4) * speed) / 20) * rotationIntensity;
              this.instance.value.position.y = (Math.sin((t / 4) * speed) / 10) * floatIntensity;
            }
          },
        })
      );
    });
  }
}

@NgModule({
  imports: [NgtSobaFloat, NgtSobaFloatContent],
  exports: [NgtSobaFloat, NgtSobaFloatContent],
})
export class NgtSobaFloatModule {}
