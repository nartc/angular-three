import {
  AnyFunction,
  BooleanInput,
  coerceBooleanProperty,
  NGT_OBJECT_REF,
  NgtObjectInputs,
  NgtObjectInputsState,
  NgtObjectPassThrough,
  provideObjectHostRef,
  Ref,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/group';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
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
import { asyncScheduler, combineLatest, filter, observeOn, pipe, switchMap, tap } from 'rxjs';
import * as THREE from 'three';

@Directive({
  selector: 'ng-template[ngt-soba-center-content]',
  standalone: true,
})
export class NgtSobaCenterContent {
  constructor(public templateRef: TemplateRef<{ group: Ref<THREE.Group> }>) {}

  static ngTemplateContextGuard(dir: NgtSobaCenterContent, ctx: any): ctx is { group: Ref<THREE.Group> } {
    return true;
  }
}

export interface NgtSobaCenterState extends NgtObjectInputsState<THREE.Group> {
  innerGroup: Ref<THREE.Group>;
  outerGroup: Ref<THREE.Group>;

  alignTop: boolean;
}

@Component({
  selector: 'ngt-soba-center',
  standalone: true,
  template: `
    <ngt-group [ngtObjectInputs]="this" [ngtObjectOutputs]="this" skipParent>
      <ngt-group [ref]="outerGroup">
        <ngt-group [ref]="innerGroup">
          <ng-container
            *ngIf="content"
            [ngTemplateOutlet]="content.templateRef"
            [ngTemplateOutletContext]="{ group: innerGroup }"
          ></ng-container>
        </ngt-group>
      </ngt-group>
    </ngt-group>
    <ng-content></ng-content>
  `,
  imports: [NgtGroup, NgtObjectPassThrough, NgIf, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaCenter, (center) => center.innerGroup)],
})
export class NgtSobaCenter extends NgtObjectInputs<THREE.Group, NgtSobaCenterState> implements AfterContentInit {
  @Input() set alignTop(alignTop: BooleanInput) {
    this.set({ alignTop: coerceBooleanProperty(alignTop) });
  }

  @ContentChild(NgtSobaCenterContent) content?: NgtSobaCenterContent;
  @ContentChildren(NGT_OBJECT_REF) children!: QueryList<AnyFunction>;

  get innerGroup() {
    return this.get((s) => s.innerGroup);
  }

  get outerGroup() {
    return this.get((s) => s.outerGroup);
  }

  protected override preInit(): void {
    super.preInit();
    this.set((state) => ({
      innerGroup: new Ref(),
      outerGroup: new Ref(),
      alignTop: state.alignTop ?? false,
    }));
  }

  ngAfterContentInit() {
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.setPosition(
          this.select(
            this.innerGroup.pipe(filter((group) => !!group)),
            this.outerGroup.pipe(filter((group) => !!group)),
            this.select((s) => s.alignTop),
            this.children.changes.pipe(switchMap(() => combineLatest(this.children.map((child) => child()))))
          )
        );
      });
    });
  }

  private readonly setPosition = this.effect(
    pipe(
      observeOn(asyncScheduler),
      tap(() => {
        const { outerGroup, innerGroup, alignTop } = this.get();
        outerGroup.value.position.set(0, 0, 0);
        outerGroup.value.updateWorldMatrix(true, true);
        const box3 = new THREE.Box3().setFromObject(innerGroup.value);
        const center = new THREE.Vector3();
        const sphere = new THREE.Sphere();
        const height = box3.max.y - box3.min.y;
        box3.getCenter(center);
        box3.getBoundingSphere(sphere);
        outerGroup.value.position.set(-center.x, -center.y + (alignTop ? height / 2 : 0), -center.z);
      })
    )
  );
}

@NgModule({
  imports: [NgtSobaCenter, NgtSobaCenterContent],
  exports: [NgtSobaCenter, NgtSobaCenterContent],
})
export class NgtSobaCenterModule {}
