import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObject3dController,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtRender,
  NgtSobaExtender,
} from '@angular-three/core';
import { NgtLodModule } from '@angular-three/core/lod';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Injectable,
  Input,
  NgModule,
  QueryList,
} from '@angular/core';
import { asapScheduler } from '@rx-angular/cdk/zone-less';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, observeOn, startWith } from 'rxjs';
import * as THREE from 'three';

interface NgtSobaDetailedStoreState {
  lod: THREE.LOD;
  distances: number[];
  children: THREE.Object3D[];
}

@Injectable()
export class NgtSobaDetailedStore extends EnhancedRxState<NgtSobaDetailedStoreState> {
  #updateLodChildrenParams$ = this.select(selectSlice(['lod', 'children']));

  constructor() {
    super();
    this.set({ distances: [], children: [] });
    this.hold(this.#updateLodChildrenParams$, ({ lod, children }) => {
      const distances = this.get('distances');
      if (!children.length) lod.levels.length = 0;
      children.forEach((object, index) => {
        lod.addLevel(object, distances[index]);
      });
    });
  }
}

@Component({
  selector: 'ngt-soba-detailed',
  template: `
    <ngt-lod
      #lod="ngtLod"
      (ready)="onLodReady(lod.lod)"
      (animateReady)="onLodAnimateReady($event, lod.lod)"
      [object3dInputsController]="objectInputsController"
    ></ngt-lod>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NgtSobaDetailedStore,
    {
      provide: NgtSobaExtender,
      useExisting: NgtSobaDetailed,
    },
  ],
})
export class NgtSobaDetailed
  extends NgtSobaExtender<THREE.LOD>
  implements AfterContentInit
{
  @Input() set distances(v: number[]) {
    this.detailedStore.set({ distances: v });
  }

  @ContentChildren(NgtObject3dController, { descendants: true })
  children!: QueryList<NgtObject3dController>;

  @ContentChildren(NgtSobaExtender, { descendants: true })
  extenders!: QueryList<NgtSobaExtender<THREE.Object3D>>;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    private detailedStore: NgtSobaDetailedStore
  ) {
    super();
  }

  ngAfterContentInit() {
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
          QueryList<NgtSobaExtender<THREE.Object3D>>,
          QueryList<NgtObject3dController>
        ]) => [
          ...childrenList.map((child) => child.object3d),
          ...extendersList.map((extender) => extender.object),
        ]
      )
    );
    this.detailedStore.connect('children', children$);
  }

  onLodAnimateReady({ camera }: NgtRender, lod: THREE.LOD) {
    lod.update(camera);
  }

  onLodReady(lod: THREE.LOD) {
    this.object = lod;
    this.detailedStore.set({ lod });
  }
}

@NgModule({
  declarations: [NgtSobaDetailed],
  exports: [NgtSobaDetailed, NgtObject3dInputsControllerModule],
  imports: [NgtLodModule],
})
export class NgtSobaDetailedModule {}
