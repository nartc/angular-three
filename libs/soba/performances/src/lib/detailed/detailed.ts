import {
  AnyFunction,
  NGT_OBJECT_REF,
  NgtObjectInputs,
  NgtObjectPassThroughModule,
  NgtRenderState,
  provideObjectHostRef,
  Ref,
} from '@angular-three/core';
import { NgtLodModule } from '@angular-three/core/lod';
import { CommonModule } from '@angular/common';
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
import { asyncScheduler, defer, observeOn, of, pipe, startWith, tap } from 'rxjs';
import * as THREE from 'three';

@Directive({
  selector: 'ng-template[ngt-soba-detailed-content]',
})
export class NgtSobaDetailedContent {
  @ContentChildren(NGT_OBJECT_REF) children!: QueryList<AnyFunction<Ref>>;

  constructor(public templateRef: TemplateRef<{ lod: Ref<THREE.LOD> }>) {}

  static ngTemplateContextGuard(dir: NgtSobaDetailedContent, ctx: any): ctx is { lod: Ref<THREE.LOD> } {
    return true;
  }
}

@Component({
  selector: 'ngt-soba-detailed',
  template: `
    <ngt-lod [ngtObjectOutputs]="this" [ngtObjectInputs]="this" (beforeRender)="onBeforeRender($event)">
      <ng-container
        *ngIf="content"
        [ngTemplateOutlet]="content.templateRef"
        [ngTemplateOutletContext]="{ lod: instance }"
      ></ng-container>
    </ngt-lod>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaDetailed)],
})
export class NgtSobaDetailed extends NgtObjectInputs<THREE.LOD> {
  @ContentChild(NgtSobaDetailedContent) content?: NgtSobaDetailedContent;

  @Input() set distances(distances: number[]) {
    this.set({ distances });
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      distances: state['distances'] ?? [],
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.addLevels(
          this.select(
            this.select((s) => s['distances']),
            this.instance$,
            defer(() => {
              return this.content?.children.changes.pipe(startWith(this.content?.children)) || of(null);
            })
          )
        );
      });
    });
  }

  private readonly addLevels = this.effect<{}>(
    pipe(
      observeOn(asyncScheduler),
      tap(() => {
        const distances = this.get((s) => s['distances']);
        if (this.instance.value) {
          this.instance.value.levels.length = 0;
          this.instance.value.children.forEach((object, index) => {
            this.instance.value.levels.push({
              object,
              distance: distances[index],
            });
          });
        }
      })
    )
  );

  onBeforeRender({ state: { camera }, object }: { state: NgtRenderState; object: THREE.LOD }) {
    object.update(camera);
  }
}

@NgModule({
  declarations: [NgtSobaDetailed, NgtSobaDetailedContent],
  exports: [NgtSobaDetailed, NgtSobaDetailedContent],
  imports: [NgtLodModule, NgtObjectPassThroughModule, CommonModule],
})
export class NgtSobaDetailedModule {}
