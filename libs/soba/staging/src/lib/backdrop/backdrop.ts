import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'ngt-soba-backdrop',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaBackdrop {
    constructor() {
        console.warn(`<ngt-soba-backdrop> is being reworked`);
    }
}

@NgModule({
    declarations: [NgtSobaBackdrop],
    exports: [NgtSobaBackdrop],
})
export class NgtSobaBackdropModule {}

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
//     NgtMathPipeModule,
//     NgtObjectInputsController,
//     NgtObjectInputsControllerModule,
//     NgtRadianPipeModule,
//     NgtStore,
// } from '@angular-three/core';
// import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
// import { NgtGroupModule } from '@angular-three/core/group';
// import { NgtMeshModule } from '@angular-three/core/meshes';
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
// import { tap } from 'rxjs';
// import * as THREE from 'three';
//
// interface NgtSobaBackdropState {
//     plane: THREE.PlaneGeometry;
//     floor: number;
//     segments: number;
//     receiveShadow: boolean;
// }
//
// const easeInExpo = (x: number) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));
//
// @Component({
//     selector: 'ngt-soba-backdrop',
//     template: `
//         <ngt-group
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
//             <ngt-mesh
//                 (ready)="object = $event"
//                 [receiveShadow]="receiveShadow"
//                 [rotation]="[-90 | radian, 0, 90 | radian]"
//             >
//                 <ngt-plane-geometry
//                     (ready)="store.set({ plane: $event })"
//                     [args]="[1, 1, segments, segments]"
//                 ></ngt-plane-geometry>
//                 <ng-container
//                     *ngIf="object"
//                     [ngTemplateOutlet]="contentTemplate"
//                 ></ng-container>
//             </ngt-mesh>
//             <ng-template #contentTemplate>
//                 <ng-content></ng-content>
//             </ng-template>
//         </ngt-group>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     providers: [
//         NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//         createExtenderProvider(NgtSobaBackdrop),
//         NgtStore,
//         createParentObjectProvider(
//             NgtSobaBackdrop,
//             (backdrop) => backdrop.object
//         ),
//         createHostParentObjectProvider(NgtSobaBackdrop),
//     ],
// })
// export class NgtSobaBackdrop extends NgtExtender<THREE.Mesh> {
//     @Input() set floor(floor: number) {
//         this.store.set({ floor });
//     }
//
//     @Input() set segments(segments: number) {
//         this.store.set({ segments });
//     }
//
//     get segments() {
//         return this.store.get((s) => s.segments);
//     }
//
//     @Input() set receiveShadow(receiveShadow: boolean) {
//         this.store.set({ receiveShadow });
//     }
//
//     get receiveShadow() {
//         return this.store.get((s) => s.receiveShadow);
//     }
//
//     constructor(
//         @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
//         public objectInputsController: NgtObjectInputsController,
//         public store: NgtStore<NgtSobaBackdropState>,
//         private zone: NgZone,
//         private canvasStore: NgtCanvasStore,
//         @Optional()
//         @SkipSelf()
//         @Inject(NGT_PARENT_OBJECT)
//         public parentObjectFn: AnyFunction
//     ) {
//         super();
//         store.set({
//             receiveShadow: false,
//             floor: 0.25,
//             segments: 20,
//         });
//     }
//
//     private computeVertexParams$ = this.store.select(
//         this.store.select((s) => s.floor),
//         this.store.select((s) => s.segments),
//         this.store.select((s) => s.plane),
//         (floor, segments, plane) => ({ floor, segments, plane })
//     );
//
//     private readonly computeVertex = this.store.effect<
//         Pick<NgtSobaBackdropState, 'floor' | 'segments' | 'plane'>
//     >(
//         tap(({ floor, segments, plane }) => {
//             if (plane) {
//                 let i = 0;
//                 const offset = segments / segments / 2;
//                 const position = plane.attributes['position'];
//                 for (let x = 0; x < segments + 1; x++) {
//                     for (let y = 0; y < segments + 1; y++) {
//                         position.setXYZ(
//                             i++,
//                             x / segments - offset + (x === 0 ? -floor : 0),
//                             y / segments - offset,
//                             easeInExpo(x / segments)
//                         );
//                     }
//                 }
//                 position.needsUpdate = true;
//                 plane.computeVertexNormals();
//             }
//         })
//     );
//
//     ngOnInit() {
//         this.zone.runOutsideAngular(() => {
//             this.store.onCanvasReady(this.canvasStore.ready$, () => {
//                 this.computeVertex(this.computeVertexParams$);
//             });
//         });
//     }
// }
//
// @NgModule({
//     declarations: [NgtSobaBackdrop],
//     exports: [NgtSobaBackdrop, NgtObjectInputsControllerModule],
//     imports: [
//         NgtGroupModule,
//         NgtMeshModule,
//         NgtPlaneGeometryModule,
//         NgtMathPipeModule,
//         NgtRadianPipeModule,
//         CommonModule,
//     ],
// })
// export class NgtSobaBackdropModule {}
