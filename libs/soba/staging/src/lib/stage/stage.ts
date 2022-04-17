import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'ngt-soba-stage',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaStage {
    constructor() {
        console.warn(`<ngt-soba-stage> is being reworked`);
    }
}

@NgModule({
    declarations: [NgtSobaStage],
    exports: [NgtSobaStage],
})
export class NgtSobaStageModule {}

// import {
//     AnyFunction,
//     createHostParentObjectProvider,
//     createParentObjectProvider,
//     NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//     NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
//     NGT_PARENT_OBJECT,
//     NgtCanvasStore,
//     NgtObjectInputsController,
//     NgtObjectInputsControllerModule,
//     NgtStore,
//     tapEffect,
// } from '@angular-three/core';
// import { NgtGroupModule } from '@angular-three/core/group';
// import {
//     NgtAmbientLightModule,
//     NgtPointLightModule,
//     NgtSpotLightModule,
// } from '@angular-three/core/lights';
// import { CommonModule } from '@angular/common';
// import {
//     AfterContentInit,
//     ChangeDetectionStrategy,
//     ChangeDetectorRef,
//     Component,
//     ContentChildren,
//     Inject,
//     Input,
//     NgModule,
//     NgZone,
//     Optional,
//     QueryList,
//     SkipSelf,
// } from '@angular/core';
// import { Observable, startWith, tap } from 'rxjs';
// import * as THREE from 'three';
// import { NgtSobaContactShadowsModule } from '../contact-shadows/contact-shadows';
// import { NgtSobaEnvironmentModule } from '../environment/environment';
// import { PresetsType } from '../environment/presets';
//
// const presets = {
//     rembrandt: {
//         main: [1, 2, 1],
//         fill: [-2, -0.5, -2],
//     },
//     portrait: {
//         main: [-1, 2, 0.5],
//         fill: [-1, 0.5, -1.5],
//     },
//     upfront: {
//         main: [0, 2, 1],
//         fill: [-1, 0.5, -1.5],
//     },
//     soft: {
//         main: [-2, 4, 4],
//         fill: [-1, 0.5, -1.5],
//     },
// };
//
// type ControlsProto = { update(): void; target: THREE.Vector3 };
//
// interface NgtSobaStageState {
//     innerGroup: THREE.Group;
//     outerGroup: THREE.Group;
//     radius: number;
//     width: number;
//     height: number;
//     shadows: boolean;
//     adjustCamera: boolean;
//     environment: PresetsType;
//     intensity: number;
//     ambience: number;
//     // TODO: in a new major state.controls should be the only means of consuming controls, the
//     // controls prop can then be removed!
//     controls: ControlsProto | null;
//     preset: keyof typeof presets;
//     shadowBias: number;
//     contactShadow:
//         | {
//               blur: number;
//               opacity?: number;
//               position?: [x: number, y: number, z: number];
//           }
//         | false;
// }
//
// @Component({
//     selector: 'ngt-soba-stage',
//     template: `
//         <ngt-group
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
//             <ngt-group (ready)="set({ outerGroup: $event })">
//                 <ngt-group (ready)="set({ innerGroup: $event })">
//                     <ng-container
//                         *ngIf="innerGroup"
//                         [ngTemplateOutlet]="contentTemplate"
//                     ></ng-container>
//                 </ngt-group>
//             </ngt-group>
//
//             <ng-template #contentTemplate>
//                 <ng-content></ng-content>
//             </ng-template>
//
//             <ng-container *ngIf="vm$ | async as vm">
//                 <ngt-soba-contact-shadows
//                     *ngIf="vm.contactShadow"
//                     [width]="vm.radius * 2"
//                     [height]="vm.radius * 2"
//                     [far]="vm.radius / 2"
//                     [blur]="$any(vm.contactShadow?.blur)"
//                     [opacity]="$any(vm.contactShadow?.opacity)"
//                     [position]="$any(vm.contactShadow?.position)"
//                 ></ngt-soba-contact-shadows>
//                 <ngt-soba-environment
//                     [preset]="vm.environment"
//                 ></ngt-soba-environment>
//                 <ngt-ambient-light
//                     [intensity]="vm.intensity / 3"
//                 ></ngt-ambient-light>
//                 <ngt-spot-light
//                     [position]="[
//                         presets[vm.preset].main[0] * vm.radius,
//                         presets[vm.preset].main[1] * vm.radius,
//                         presets[vm.preset].main[2] * vm.radius
//                     ]"
//                     [args]="[
//                         undefined,
//                         vm.intensity * 2,
//                         undefined,
//                         undefined,
//                         1
//                     ]"
//                     [castShadow]="vm.shadows"
//                     [shadow]="{ bias: vm.shadowBias }"
//                 ></ngt-spot-light>
//                 <ngt-point-light
//                     [intensity]="vm.intensity"
//                     [position]="[
//                         presets[vm.preset].fill[0] * vm.radius,
//                         presets[vm.preset].fill[1] * vm.radius,
//                         presets[vm.preset].fill[2] * vm.radius
//                     ]"
//                 ></ngt-point-light>
//             </ng-container>
//         </ngt-group>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     providers: [
//         NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//         createParentObjectProvider(NgtSobaStage, (stage) => stage.innerGroup),
//         createHostParentObjectProvider(NgtSobaStage),
//     ],
// })
// export class NgtSobaStage
//     extends NgtStore<NgtSobaStageState>
//     implements AfterContentInit
// {
//     @Input() set shadows(shadows: boolean) {
//         this.set({ shadows });
//     }
//
//     @Input() set adjustCamera(adjustCamera: boolean) {
//         this.set({ adjustCamera });
//     }
//
//     @Input() set environment(environment: PresetsType) {
//         this.set({ environment });
//     }
//
//     @Input() set intensity(intensity: number) {
//         this.set({ intensity });
//     }
//
//     @Input() set ambience(ambience: number) {
//         this.set({ ambience });
//     }
//
//     @Input() set controls(controls: ControlsProto | null) {
//         this.set({ controls });
//     }
//
//     @Input() set preset(preset: keyof typeof presets) {
//         this.set({ preset });
//     }
//
//     @Input() set shadowBias(shadowBias: number) {
//         this.set({ shadowBias });
//     }
//
//     @Input() set contactShadow(
//         contactShadow:
//             | {
//                   blur: number;
//                   opacity?: number;
//                   position?: [x: number, y: number, z: number];
//               }
//             | false
//     ) {
//         this.set({ contactShadow });
//     }
//
//     @ContentChildren(NgtObjectInputsController)
//     children!: QueryList<NgtObjectInputsController>;
//
//     private adjustCameraParams$ = this.select(
//         this.canvasStore.select(
//             (s) => s.controls
//         ) as unknown as Observable<ControlsProto>,
//         this.select((s) => s.radius),
//         this.select((s) => s.width),
//         this.select((s) => s.height),
//         this.select((s) => s.adjustCamera),
//         (controls, radius, width, height, adjustCamera) => ({
//             controls,
//             radius,
//             width,
//             height,
//             adjustCamera,
//         })
//     );
//
//     presets = presets;
//     vm$ = this.select(
//         this.select((s) => s.preset),
//         this.select((s) => s.environment),
//         this.select((s) => s.contactShadow),
//         this.select((s) => s.radius),
//         this.select((s) => s.intensity),
//         this.select((s) => s.shadows),
//         this.select((s) => s.shadowBias),
//         (
//             preset,
//             environment,
//             contactShadow,
//             radius,
//             intensity,
//             shadows,
//             shadowBias
//         ) => ({
//             preset,
//             environment,
//             contactShadow,
//             radius,
//             intensity,
//             shadows,
//             shadowBias,
//         })
//     );
//
//     get innerGroup() {
//         return this.get((s) => s.innerGroup);
//     }
//
//     constructor(
//         @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
//         public objectInputsController: NgtObjectInputsController,
//         private canvasStore: NgtCanvasStore,
//         private zone: NgZone,
//         private cdr: ChangeDetectorRef,
//         @Optional()
//         @SkipSelf()
//         @Inject(NGT_PARENT_OBJECT)
//         public parentObjectFn: AnyFunction
//     ) {
//         super();
//         this.set({
//             radius: 0,
//             width: 0,
//             height: 0,
//             shadows: true,
//             adjustCamera: true,
//             environment: 'city',
//             intensity: 1,
//             preset: 'rembrandt',
//             shadowBias: 0,
//             contactShadow: {
//                 blur: 2,
//                 opacity: 0.5,
//                 position: [0, 0, 0],
//             },
//         });
//     }
//
//     ngAfterContentInit() {
//         this.zone.runOutsideAngular(() => {
//             this.onCanvasReady(this.canvasStore.ready$, () => {
//                 this.calculateDimensions(
//                     this.select(
//                         this.select((s) => s.outerGroup),
//                         this.select((s) => s.innerGroup),
//                         this.children.changes.pipe(startWith(this.children)),
//                         (outerGroup, innerGroup) => ({
//                             outerGroup,
//                             innerGroup,
//                         })
//                     )
//                 );
//                 this.adjustCameraPosition(this.adjustCameraParams$);
//             });
//         });
//     }
//
//     private readonly adjustCameraPosition = this.effect<
//         Pick<
//             NgtSobaStageState,
//             'radius' | 'width' | 'height' | 'adjustCamera'
//         > & { controls: ControlsProto }
//     >(
//         tap(
//             ({
//                 radius,
//                 width,
//                 height,
//                 adjustCamera,
//                 controls: defaultControls,
//             }) => {
//                 const camera = this.canvasStore.get((s) => s.camera);
//                 if (adjustCamera) {
//                     const y = radius / (height > width ? 1.5 : 2.5);
//                     camera.position.set(0, radius * 0.5, radius * 2.5);
//                     camera.near = 0.1;
//                     camera.far = Math.max(5000, radius * 4);
//                     camera.lookAt(0, y, 0);
//
//                     const currentControls =
//                         defaultControls || this.get((s) => s.controls);
//                     if (currentControls) {
//                         currentControls.target.set(0, y, 0);
//                         currentControls.update();
//                     }
//                 }
//             }
//         )
//     );
//
//     private readonly calculateDimensions = this.effect<
//         Pick<NgtSobaStageState, 'outerGroup' | 'innerGroup'>
//     >(
//         tapEffect(({ outerGroup, innerGroup }) => {
//             const id = requestAnimationFrame(() => {
//                 outerGroup.position.set(0, 0, 0);
//                 outerGroup.updateWorldMatrix(true, true);
//                 const box3 = new THREE.Box3().setFromObject(innerGroup);
//                 const center = new THREE.Vector3();
//                 const sphere = new THREE.Sphere();
//                 const height = box3.max.y - box3.min.y;
//                 const width = box3.max.x - box3.min.x;
//                 box3.getCenter(center);
//                 box3.getBoundingSphere(sphere);
//                 this.set({ radius: sphere.radius, width, height });
//                 outerGroup.position.set(
//                     -center.x,
//                     -center.y + height / 2,
//                     -center.z
//                 );
//                 this.cdr.detectChanges();
//             });
//
//             return () => {
//                 cancelAnimationFrame(id);
//             };
//         })
//     );
// }
//
// @NgModule({
//     declarations: [NgtSobaStage],
//     exports: [NgtSobaStage, NgtObjectInputsControllerModule],
//     imports: [
//         NgtGroupModule,
//         NgtSobaEnvironmentModule,
//         NgtAmbientLightModule,
//         NgtSpotLightModule,
//         NgtPointLightModule,
//         NgtSobaContactShadowsModule,
//         CommonModule,
//     ],
// })
// export class NgtSobaStageModule {}
