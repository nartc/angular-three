import {
  EnhancedComponentStore,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtCoreModule,
  NgtObject3dController,
  NgtObject3dInputsController,
  NgtRender,
} from '@angular-three/core';
import { NgtLodModule } from '@angular-three/core/lod';
import { NgtSobaExtender } from '@angular-three/soba';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Injectable,
  Input,
  NgModule,
  NgZone,
  QueryList,
} from '@angular/core';
import {
  asapScheduler,
  combineLatest,
  filter,
  map,
  observeOn,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs';
import * as THREE from 'three';

interface NgtSobaDetailedStoreState {
  lod: THREE.LOD | null;
  distances: number[];
  children: THREE.Object3D[];
}

@Injectable()
export class NgtSobaDetailedStore extends EnhancedComponentStore<NgtSobaDetailedStoreState> {
  #updateLodChildrenParams$ = this.select(
    this.selectors.lod$.pipe(filter((lod): lod is THREE.LOD => lod !== null)),
    this.selectors.children$,
    (lod, children) => ({ lod, children }),
    { debounce: true }
  );

  constructor(private ngZone: NgZone) {
    super({ lod: null, distances: [], children: [] });
  }

  readonly init = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.#updateLodChildren(this.#updateLodChildrenParams$);
      })
    )
  );

  #updateLodChildren = this.effect<{
    lod: THREE.LOD;
    children: THREE.Object3D[];
  }>((params$) =>
    params$.pipe(
      withLatestFrom(this.selectors.distances$),
      tap(([{ children, lod }, distances]) => {
        this.ngZone.runOutsideAngular(() => {
          if (lod) {
            lod.levels.length = 0;
            children.forEach((object, index) => {
              lod.addLevel(object, distances[index]);
            });
          }
        });
      })
    )
  );
}

@Component({
  selector: 'ngt-soba-detailed',
  exportAs: 'ngtSobaDetailed',
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
  providers: [NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER, NgtSobaDetailedStore],
})
export class NgtSobaDetailed
  extends NgtSobaExtender<THREE.LOD>
  implements AfterContentInit
{
  @Input() set distances(v: number[]) {
    this.detailedStore.updaters.setDistances(v);
  }

  @ContentChildren(NgtObject3dController, { descendants: true })
  children!: QueryList<NgtObject3dController>;

  @ContentChildren(NgtSobaExtender, { descendants: true })
  extenders!: QueryList<NgtSobaExtender<THREE.Object3D>>;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    private detailedStore: NgtSobaDetailedStore,
    private ngZone: NgZone
  ) {
    super();
  }

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
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

      this.detailedStore.init();
      this.detailedStore.updaters.setChildren(children$);
    });
  }

  onLodAnimateReady({ camera }: NgtRender, lod: THREE.LOD) {
    lod.update(camera);
  }

  onLodReady(lod: THREE.LOD) {
    this.object = lod;
    this.detailedStore.updaters.setLod(lod);
  }
}

@NgModule({
  declarations: [NgtSobaDetailed],
  exports: [NgtSobaDetailed],
  imports: [NgtLodModule, NgtCoreModule],
})
export class NgtSobaDetailedModule {}
