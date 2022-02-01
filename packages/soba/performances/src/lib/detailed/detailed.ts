import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtExtender,
  NgtObjectController,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtRender,
  NgtStore,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import { NgtLodModule } from '@angular-three/core/lod';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Input,
  NgModule,
  QueryList,
} from '@angular/core';
import { asapScheduler } from '@rx-angular/cdk/zone-less';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, observeOn, startWith } from 'rxjs';
import * as THREE from 'three';

interface NgtSobaDetailedState {
  lod: THREE.LOD;
  distances: number[];
  children: THREE.Object3D[];
}

@Component({
  selector: 'ngt-soba-detailed',
  template: `
    <ngt-lod
      (ready)="onLodReady($event)"
      (animateReady)="onLodAnimateReady($event.state, $event.object)"
      [objectInputsController]="objectInputsController"
    ></ngt-lod>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NgtStore,
    {
      provide: NgtExtender,
      useExisting: NgtSobaDetailed,
    },
  ],
})
export class NgtSobaDetailed
  extends NgtExtender<THREE.LOD>
  implements AfterContentInit
{
  @Input() set distances(distances: number[]) {
    this.store.set({ distances });
  }

  @ContentChildren(NgtObjectController, { descendants: true })
  children!: QueryList<NgtObjectController>;

  @ContentChildren(NgtExtender, { descendants: true })
  extenders!: QueryList<NgtExtender<THREE.Object3D>>;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController,
    private store: NgtStore<NgtSobaDetailedState>
  ) {
    super();
    store.set({ distances: [], children: [] });
  }

  ngAfterContentInit() {
    zonelessRequestAnimationFrame(() => {
      this.store.hold(
        this.store.select(selectSlice(['lod', 'children'])),
        ({ lod, children }) => {
          const distances = this.store.get('distances');
          if (!children.length) lod.levels.length = 0;
          children.forEach((object, index) => {
            lod.addLevel(object, distances[index]);
          });
        }
      );

      const children$ = combineLatest([
        this.extenders.changes.pipe(
          startWith(this.extenders),
          observeOn(asapScheduler)
        ),
        this.children.changes.pipe(
          startWith(this.children),
          observeOn(asapScheduler)
        ),
      ]).pipe(
        map(
          ([extendersList, childrenList]: [
            QueryList<NgtExtender<THREE.Object3D>>,
            QueryList<NgtObjectController>
          ]) => [
            ...childrenList.map((child) => child.object),
            ...extendersList.map((extender) => extender.object),
          ]
        )
      );
      this.store.connect('children', children$);
    });
  }

  onLodAnimateReady(state: NgtRender, lod: THREE.Object3D) {
    (lod as THREE.LOD).update(state.camera);
    this.animateReady.emit({ entity: lod as THREE.LOD, state });
  }

  onLodReady(lod: THREE.LOD) {
    this.object = lod;
    this.store.set({ lod });
  }
}

@NgModule({
  declarations: [NgtSobaDetailed],
  exports: [NgtSobaDetailed, NgtObjectInputsControllerModule],
  imports: [NgtLodModule],
})
export class NgtSobaDetailedModule {}
