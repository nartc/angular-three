import {
    createExtenderProvider,
    createParentObjectProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NgtCanvasStore,
    NgtExtender,
    NgtObjectController,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtRender,
    NgtStore,
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
    NgZone,
    QueryList,
} from '@angular/core';
import { merge, startWith, tap } from 'rxjs';
import * as THREE from 'three';

interface NgtSobaDetailedState {
    lod: THREE.LOD;
    distances: number[];
}

@Component({
    selector: 'ngt-soba-detailed',
    template: `
        <ngt-lod
            (ready)="onLodReady($event)"
            (animateReady)="onLodAnimateReady($event.state, $event.object)"
            [name]="objectInputsController.name"
            [position]="objectInputsController.position"
            [rotation]="objectInputsController.rotation"
            [quaternion]="objectInputsController.quaternion"
            [scale]="objectInputsController.scale"
            [color]="objectInputsController.color"
            [userData]="objectInputsController.userData"
            [castShadow]="objectInputsController.castShadow"
            [receiveShadow]="objectInputsController.receiveShadow"
            [visible]="objectInputsController.visible"
            [matrixAutoUpdate]="objectInputsController.matrixAutoUpdate"
            [dispose]="objectInputsController.dispose"
            [raycast]="objectInputsController.raycast"
            [appendMode]="objectInputsController.appendMode"
            [appendTo]="objectInputsController.appendTo"
            (click)="objectInputsController.click.emit($event)"
            (contextmenu)="objectInputsController.contextmenu.emit($event)"
            (dblclick)="objectInputsController.dblclick.emit($event)"
            (pointerup)="objectInputsController.pointerup.emit($event)"
            (pointerdown)="objectInputsController.pointerdown.emit($event)"
            (pointerover)="objectInputsController.pointerover.emit($event)"
            (pointerout)="objectInputsController.pointerout.emit($event)"
            (pointerenter)="objectInputsController.pointerenter.emit($event)"
            (pointerleave)="objectInputsController.pointerleave.emit($event)"
            (pointermove)="objectInputsController.pointermove.emit($event)"
            (pointermissed)="objectInputsController.pointermissed.emit($event)"
            (pointercancel)="objectInputsController.pointercancel.emit($event)"
            (wheel)="objectInputsController.wheel.emit($event)"
        >
            <ng-content></ng-content>
        </ngt-lod>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        NgtStore,
        createExtenderProvider(NgtSobaDetailed),
        createParentObjectProvider(
            NgtSobaDetailed,
            (detailed) => detailed.object
        ),
    ],
})
export class NgtSobaDetailed
    extends NgtExtender<THREE.LOD>
    implements AfterContentInit
{
    @Input() set distances(distances: number[]) {
        this.store.set({ distances });
    }

    @ContentChildren(NgtObjectController)
    children!: QueryList<NgtObjectController>;

    @ContentChildren(NgtExtender)
    extenders!: QueryList<NgtExtender<THREE.Object3D>>;

    constructor(
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        private store: NgtStore<NgtSobaDetailedState>,
        private canvasStore: NgtCanvasStore,
        private zone: NgZone
    ) {
        super();
        store.set({ distances: [] });
    }

    private readonly updateLevels = this.store.effect<THREE.LOD>(
        tap((lod) => {
            const distances = this.store.get((s) => s.distances);
            lod.levels.length = 0;
            lod.children.forEach((object, index) => {
                lod.levels.push({ object, distance: distances[index] });
            });
        })
    );

    ngAfterContentInit() {
        // setup childrenParams$ here because QueryList aren't available in ngOnInit
        const childrenParams$ = this.store.select(
            this.store.select((s) => s.lod),
            merge(
                this.extenders.changes.pipe(startWith(this.extenders)),
                this.children.changes.pipe(startWith(this.children))
            ),
            (lod) => lod
        );
        this.zone.runOutsideAngular(() => {
            this.store.onCanvasReady(this.canvasStore.ready$, () => {
                requestAnimationFrame(() => {
                    this.updateLevels(childrenParams$);
                });
            });
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
