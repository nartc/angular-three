import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'ngt-soba-float',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaFloat {
    constructor() {
        console.warn(`<ngt-soba-float> is being reworked`);
    }
}

@NgModule({
    declarations: [NgtSobaFloat],
    exports: [NgtSobaFloat],
})
export class NgtSobaFloatModule {}

// import {
//     AnyFunction,
//     createExtenderProvider,
//     createHostParentObjectProvider,
//     createParentObjectProvider,
//     NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//     NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
//     NGT_PARENT_OBJECT,
//     NgtExtender,
//     NgtObjectInputsController,
//     NgtObjectInputsControllerModule,
//     NgtRender,
//     NgtStore,
// } from '@angular-three/core';
// import { NgtGroupModule } from '@angular-three/core/group';
// import { CommonModule } from '@angular/common';
// import {
//     ChangeDetectionStrategy,
//     Component,
//     Inject,
//     Input,
//     NgModule,
//     Optional,
//     SkipSelf,
// } from '@angular/core';
// import * as THREE from 'three';
//
// export interface NgtSobaFloatState {
//     speed: number;
//     rotationIntensity: number;
//     floatIntensity: number;
//     innerGroup: THREE.Group;
//     outerGroup: THREE.Group;
// }
//
// @Component({
//     selector: 'ngt-soba-float',
//     template: `
//         <ngt-group
//             (ready)="store.set({ outerGroup: $event })"
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
//                 (ready)="object = $event; store.set({ innerGroup: $event })"
//                 (animateReady)="onInnerGroupAnimate($event.state)"
//             >
//                 <ng-container
//                     *ngIf="object"
//                     [ngTemplateOutlet]="contentTemplate"
//                 ></ng-container>
//             </ngt-group>
//         </ngt-group>
//
//         <ng-template #contentTemplate>
//             <ng-content></ng-content>
//         </ng-template>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     providers: [
//         NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//         NgtStore,
//         createExtenderProvider(NgtSobaFloat),
//         createParentObjectProvider(NgtSobaFloat, (float) =>
//             float.store.get((s) => s.innerGroup)
//         ),
//         createHostParentObjectProvider(NgtSobaFloat),
//     ],
// })
// export class NgtSobaFloat extends NgtExtender<THREE.Group> {
//     @Input() set speed(speed: number) {
//         this.store.set({ speed });
//     }
//
//     @Input() set rotationIntensity(rotationIntensity: number) {
//         this.store.set({ rotationIntensity });
//     }
//
//     @Input() set floatIntensity(floatIntensity: number) {
//         this.store.set({ floatIntensity });
//     }
//
//     private offset = Math.random() * 10000;
//
//     constructor(
//         @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
//         public objectInputsController: NgtObjectInputsController,
//         public store: NgtStore<NgtSobaFloatState>,
//         @Optional()
//         @SkipSelf()
//         @Inject(NGT_PARENT_OBJECT)
//         public parentObjectFn: AnyFunction
//     ) {
//         super();
//         store.set({
//             speed: 1,
//             rotationIntensity: 1,
//             floatIntensity: 1,
//         });
//     }
//
//     onInnerGroupAnimate(state: NgtRender) {
//         if (this.object) {
//             const { speed, rotationIntensity, floatIntensity } =
//                 this.store.get();
//             const t = this.offset + state.clock.getElapsedTime();
//             this.object.rotation.x =
//                 (Math.cos((t / 4) * speed) / 8) * rotationIntensity;
//             this.object.rotation.y =
//                 (Math.sin((t / 4) * speed) / 8) * rotationIntensity;
//             this.object.rotation.z =
//                 (Math.sin((t / 4) * speed) / 20) * rotationIntensity;
//             this.object.position.y =
//                 (Math.sin((t / 4) * speed) / 10) * floatIntensity;
//
//             this.animateReady.emit({ entity: this.object, state });
//         }
//     }
// }
//
// @NgModule({
//     declarations: [NgtSobaFloat],
//     exports: [NgtSobaFloat, NgtObjectInputsControllerModule],
//     imports: [NgtGroupModule, CommonModule],
// })
// export class NgtSobaFloatModule {}
