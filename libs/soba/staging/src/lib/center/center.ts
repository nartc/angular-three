import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'ngt-soba-center',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaCenter {
    constructor() {
        console.warn(`<ngt-soba-center> is being reworked`);
    }
}

@NgModule({
    declarations: [NgtSobaCenter],
    exports: [NgtSobaCenter],
})
export class NgtSobaCenterModule {}

// import {
//     AnyFunction,
//     createExtenderProvider,
//     createHostParentObjectProvider,
//     createParentObjectProvider,
//     NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//     NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
//     NGT_PARENT_OBJECT,
//     NgtCanvasStore,
//     NgtExtender,
//     NgtObjectInputsController,
//     NgtObjectInputsControllerModule,
//     NgtStore,
//     tapEffect,
// } from '@angular-three/core';
// import { NgtGroupModule } from '@angular-three/core/group';
// import { CommonModule } from '@angular/common';
// import {
//     ChangeDetectionStrategy,
//     Component,
//     Inject,
//     Input,
//     NgModule,
//     NgZone,
//     Optional,
//     SkipSelf,
// } from '@angular/core';
// import * as THREE from 'three';
//
// export interface NgtSobaCenterState {
//     alignTop: boolean;
//     innerGroup: THREE.Group;
//     outerGroup: THREE.Group;
//     contentChecked: number;
// }
//
// @Component({
//     selector: 'ngt-soba-center',
//     template: `
//         <ngt-group
//             (ready)="object = $event"
//             (animateReady)="
//                 animateReady.emit({ entity: object, state: $event.state })
//             "
//             [useHostParent]="true"
//             [name]="objectInputsController.name"
//             [position]="objectInputsController.position"
//             [rotation]="objectInputsController.rotation"
//             [quaternion]="objectInputsController.quaternion"
//             [scale]="objectInputsController.scale"
//             [color]="objectInputsController.color"
//             [userData]="objectInputsController.userData"
//             [castShadow]="objectInputsController.castShadow"
//             [receiveShadow]="objectInputsController.receiveShadow"
//             [visible]="objectInputsController.visible"
//             [matrixAutoUpdate]="objectInputsController.matrixAutoUpdate"
//             [dispose]="objectInputsController.dispose"
//             [raycast]="objectInputsController.raycast"
//             [appendMode]="objectInputsController.appendMode"
//             [appendTo]="objectInputsController.appendTo"
//             (click)="objectInputsController.click.emit($event)"
//             (contextmenu)="objectInputsController.contextmenu.emit($event)"
//             (dblclick)="objectInputsController.dblclick.emit($event)"
//             (pointerup)="objectInputsController.pointerup.emit($event)"
//             (pointerdown)="objectInputsController.pointerdown.emit($event)"
//             (pointerover)="objectInputsController.pointerover.emit($event)"
//             (pointerout)="objectInputsController.pointerout.emit($event)"
//             (pointerenter)="objectInputsController.pointerenter.emit($event)"
//             (pointerleave)="objectInputsController.pointerleave.emit($event)"
//             (pointermove)="objectInputsController.pointermove.emit($event)"
//             (pointermissed)="objectInputsController.pointermissed.emit($event)"
//             (pointercancel)="objectInputsController.pointercancel.emit($event)"
//             (wheel)="objectInputsController.wheel.emit($event)"
//         >
//             <ngt-group
//                 name="outer-soba-center-group"
//                 (ready)="store.set({ outerGroup: $event })"
//             >
//                 <ngt-group
//                     name="inner-soba-center-group"
//                     (ready)="store.set({ innerGroup: $event })"
//                 >
//                     <ng-container
//                         *ngIf="innerGroup"
//                         [ngTemplateOutlet]="contentTemplate"
//                     ></ng-container>
//                 </ngt-group>
//             </ngt-group>
//             <ng-template #contentTemplate>
//                 <ng-content></ng-content>
//             </ng-template>
//         </ngt-group>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     providers: [
//         NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//         createExtenderProvider(NgtSobaCenter),
//         NgtStore,
//         createParentObjectProvider(
//             NgtSobaCenter,
//             (center) => center.innerGroup
//         ),
//         createHostParentObjectProvider(NgtSobaCenter),
//     ],
// })
// export class NgtSobaCenter extends NgtExtender<THREE.Group> {
//     @Input() set alignTop(alignTop: boolean) {
//         this.store.set({ alignTop });
//     }
//
//     constructor(
//         @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
//         public objectInputsController: NgtObjectInputsController,
//         public store: NgtStore<NgtSobaCenterState>,
//         private canvasStore: NgtCanvasStore,
//         private zone: NgZone,
//         @Optional()
//         @SkipSelf()
//         @Inject(NGT_PARENT_OBJECT)
//         public parentObjectFn: AnyFunction
//     ) {
//         super();
//         store.set({ alignTop: false });
//     }
//
//     get innerGroup() {
//         return this.store.get((s) => s.innerGroup);
//     }
//
//     private dimensionsParams$ = this.store.select(
//         this.store.select((s) => s.alignTop),
//         this.store.select((s) => s.innerGroup),
//         this.store.select((s) => s.outerGroup),
//         this.store.select((s) => s.contentChecked),
//         (alignTop, innerGroup, outerGroup) => ({
//             alignTop,
//             innerGroup,
//             outerGroup,
//         })
//     );
//
//     private readonly calculateDimensions = this.store.effect<
//         Omit<NgtSobaCenterState, 'contentChecked'>
//     >(
//         tapEffect(({ outerGroup, innerGroup, alignTop }) => {
//             const id = requestAnimationFrame(() => {
//                 outerGroup.position.set(0, 0, 0);
//                 outerGroup.updateWorldMatrix(true, true);
//                 const box3 = new THREE.Box3().setFromObject(innerGroup);
//                 const center = new THREE.Vector3();
//                 const sphere = new THREE.Sphere();
//                 const height = box3.max.y - box3.min.y;
//                 box3.getCenter(center);
//                 box3.getBoundingSphere(sphere);
//
//                 outerGroup.position.set(
//                     -center.x,
//                     -center.y + (alignTop ? height / 2 : 0),
//                     -center.z
//                 );
//             });
//
//             return () => {
//                 cancelAnimationFrame(id);
//             };
//         })
//     );
//
//     ngOnInit() {
//         this.zone.runOutsideAngular(() => {
//             this.store.onCanvasReady(this.canvasStore.ready$, () => {
//                 this.calculateDimensions(this.dimensionsParams$);
//             });
//         });
//     }
//
//     ngAfterContentChecked() {
//         this.store.set((state) => ({
//             contentChecked: state.contentChecked ? state.contentChecked + 1 : 1,
//         }));
//     }
// }
//
// @NgModule({
//     declarations: [NgtSobaCenter],
//     exports: [NgtSobaCenter, NgtObjectInputsControllerModule],
//     imports: [CommonModule, NgtGroupModule],
// })
// export class NgtSobaCenterModule {}
