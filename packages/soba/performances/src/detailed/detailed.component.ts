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

@Component({
  selector: 'ngt-soba-detailed',
  template: `
    <ngt-lod
      #lod="ngtLod"
      (ready)="onLodReady($event)"
      (animateReady)="onLodAnimateReady($event, lod.lod)"
      [object3dInputsController]="objectInputsController"
    ></ngt-lod>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    EnhancedRxState,
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
    this.state.set({ distances: v });
  }

  @ContentChildren(NgtObject3dController, { descendants: true })
  children!: QueryList<NgtObject3dController>;

  @ContentChildren(NgtSobaExtender, { descendants: true })
  extenders!: QueryList<NgtSobaExtender<THREE.Object3D>>;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    private state: EnhancedRxState<NgtSobaDetailedStoreState>
  ) {
    super();

    state.set({ distances: [], children: [] });
    state.hold(
      state.select(selectSlice(['lod', 'children'])),
      ({ lod, children }) => {
        const distances = state.get('distances');
        if (!children.length) lod.levels.length = 0;
        children.forEach((object, index) => {
          lod.addLevel(object, distances[index]);
        });
      }
    );
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
    this.state.connect('children', children$);
  }

  onLodAnimateReady(state: NgtRender, lod: THREE.LOD) {
    lod.update(state.camera);
    this.animateReady.emit({ entity: lod, state });
  }

  onLodReady(lod: THREE.LOD) {
    this.object = lod;
    this.state.set({ lod });
  }
}

@NgModule({
  declarations: [NgtSobaDetailed],
  exports: [NgtSobaDetailed, NgtObject3dInputsControllerModule],
  imports: [NgtLodModule],
})
export class NgtSobaDetailedModule {}
