import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'ngt-soba-spot-light',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaSpotLight {
    constructor() {
        console.warn(`<ngt-soba-spot-light> is being reworked`);
    }
}

@NgModule({
    declarations: [NgtSobaSpotLight],
    exports: [NgtSobaSpotLight],
})
export class NgtSobaSpotLightModule {}

// import {
//     createExtenderProvider,
//     NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//     NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
//     NgtAnimationFrameStore,
//     NgtCanvasStore,
//     NgtColorPipeModule,
//     NgtExtender,
//     NgtObjectInputsController,
//     NgtObjectInputsControllerModule,
//     NgtStore,
//     NgtVectorPipeModule,
//     tapEffect,
// } from '@angular-three/core';
// import { NgtSpotLightModule } from '@angular-three/core/lights';
// import { NgtMeshModule } from '@angular-three/core/meshes';
// import { CommonModule } from '@angular/common';
// import {
//     ChangeDetectionStrategy,
//     Component,
//     Inject,
//     Input,
//     NgModule,
//     NgZone,
// } from '@angular/core';
// import { map } from 'rxjs';
// import * as THREE from 'three';
// import {
//     NgtSobaSpotLightMaterialModule,
//     SpotLightMaterial,
// } from './spot-light-material';
//
// interface NgtSobaSpotLightState {
//     color: THREE.ColorRepresentation;
//     intensity: number;
//     distance: number;
//     angle: number;
//     penumbra: number;
//     decay: number;
//     depthBuffer: THREE.DepthTexture | null;
//     attenuation: number;
//     anglePower: number;
//     radiusTop: number;
//     hasRadiusTop: boolean;
//     radiusBottom: number;
//     hasRadiusBottom: boolean;
//     opacity: number;
//     light: THREE.SpotLight;
//     mesh: THREE.Mesh;
//     geometry: THREE.CylinderGeometry;
//     material: SpotLightMaterial;
// }
//
// const vec = new THREE.Vector3();
//
// @Component({
//     selector: 'ngt-soba-spot-light',
//     template: `
//         <ngt-spot-light
//             *ngIf="geometry"
//             (ready)="object = $event; store.set({ light: $event })"
//             (animateReady)="
//                 animateReady.emit({ entity: object, state: $event.state })
//             "
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
//             [args]="[color, intensity, distance, angle, penumbra, decay]"
//         >
//             <ngt-mesh
//                 (ready)="store.set({ mesh: $event })"
//                 [geometry]="geometry"
//                 [raycast]="null"
//             >
//                 <ngt-soba-spot-light-material
//                     (ready)="store.set({ material: $event })"
//                     [parameters]="{
//                         uniforms: {
//                             opacity: { value: opacity },
//                             lightColor: { value: color | color },
//                             attenuation: { value: attenuation },
//                             anglePower: { value: anglePower },
//                             depth: { value: depthBuffer },
//                             cameraNear: { value: near },
//                             cameraFar: { value: far },
//                             resolution: {
//                                 value:
//                                     (depthBuffer
//                                         ? [width * dpr, height * dpr]
//                                         : [0, 0]
//                                     ) | vector2
//                             }
//                         }
//                     }"
//                 ></ngt-soba-spot-light-material>
//             </ngt-mesh>
//         </ngt-spot-light>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     providers: [
//         NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//         createExtenderProvider(NgtSobaSpotLight),
//         NgtStore,
//     ],
// })
// export class NgtSobaSpotLight extends NgtExtender<THREE.SpotLight> {
//     @Input() set color(color: THREE.ColorRepresentation) {
//         this.store.set({ color });
//     }
//
//     get color() {
//         return this.store.get((s) => s.color);
//     }
//
//     @Input() set intensity(intensity: number) {
//         this.store.set({ intensity });
//     }
//
//     get intensity() {
//         return this.store.get((s) => s.intensity);
//     }
//
//     @Input() set distance(distance: number) {
//         this.store.set({ distance });
//     }
//
//     get distance() {
//         return this.store.get((s) => s.distance);
//     }
//
//     @Input() set angle(angle: number) {
//         this.store.set({ angle });
//     }
//
//     get angle() {
//         return this.store.get((s) => s.angle);
//     }
//
//     @Input() set penumbra(penumbra: number) {
//         this.store.set({ penumbra });
//     }
//
//     get penumbra() {
//         return this.store.get((s) => s.penumbra);
//     }
//
//     @Input() set decay(decay: number) {
//         this.store.set({ decay });
//     }
//
//     get decay() {
//         return this.store.get((s) => s.decay);
//     }
//
//     @Input() set depthBuffer(depthBuffer: THREE.DepthTexture) {
//         this.store.set({ depthBuffer });
//     }
//
//     get depthBuffer() {
//         return this.store.get((s) => s.depthBuffer) as THREE.DepthTexture;
//     }
//
//     @Input() set attenuation(attenuation: number) {
//         this.store.set({ attenuation });
//     }
//
//     get attenuation() {
//         return this.store.get((s) => s.attenuation);
//     }
//
//     @Input() set anglePower(anglePower: number) {
//         this.store.set({ anglePower });
//     }
//
//     get anglePower() {
//         return this.store.get((s) => s.anglePower);
//     }
//
//     @Input() set radiusTop(radiusTop: number) {
//         this.store.set({ radiusTop, hasRadiusTop: true });
//     }
//
//     @Input() set radiusBottom(radiusBottom: number) {
//         this.store.set({ radiusBottom, hasRadiusBottom: true });
//     }
//
//     @Input() set opacity(opacity: number) {
//         this.store.set({ opacity });
//     }
//
//     get opacity() {
//         return this.store.get((s) => s.opacity);
//     }
//
//     get near() {
//         return this.canvasStore.get((s) => s.camera.near);
//     }
//
//     get far() {
//         return this.canvasStore.get((s) => s.camera.far);
//     }
//
//     get width() {
//         return this.canvasStore.get((s) => s.size.width);
//     }
//
//     get height() {
//         return this.canvasStore.get((s) => s.size.height);
//     }
//
//     get dpr() {
//         return this.canvasStore.get((s) => s.viewport.dpr);
//     }
//
//     get geometry() {
//         return this.store.get((s) => s.geometry);
//     }
//
//     constructor(
//         @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
//         public objectInputsController: NgtObjectInputsController,
//         public store: NgtStore<NgtSobaSpotLightState>,
//         private canvasStore: NgtCanvasStore,
//         private animationFrameStore: NgtAnimationFrameStore,
//         private zone: NgZone
//     ) {
//         super();
//         store.set({
//             opacity: 1,
//             radiusTop: 0.1,
//             hasRadiusTop: false,
//             radiusBottom: 0.15 * 7,
//             hasRadiusBottom: false,
//             color: 'white',
//             distance: 5,
//             angle: 0.15,
//             attenuation: 5,
//             anglePower: 5,
//         });
//     }
//
//     private geometryParams$ = this.store.select(
//         this.store.select((s) => s.angle),
//         this.store.select((s) => s.distance),
//         this.store.select((s) => s.radiusTop),
//         this.store.select((s) => s.radiusBottom),
//         this.store.select((s) => s.hasRadiusTop),
//         this.store.select((s) => s.hasRadiusBottom),
//         (
//             angle,
//             distance,
//             radiusTop,
//             radiusBottom,
//             hasRadiusBottom,
//             hasRadiusTop
//         ) => ({
//             angle,
//             distance,
//             radiusTop,
//             radiusBottom,
//             hasRadiusBottom,
//             hasRadiusTop,
//         })
//     );
//
//     private readonly registerAnimation = this.store.effect<void>(
//         tapEffect(() => {
//             const animationUuid = this.animationFrameStore.register({
//                 callback: () => {
//                     const { material, mesh } = this.store.get();
//                     if (material && mesh) {
//                         material.uniforms['spotPosition'].value.copy(
//                             mesh.getWorldPosition(vec)
//                         );
//                         if ((mesh.parent as THREE.SpotLight)?.target) {
//                             mesh.lookAt(
//                                 (
//                                     mesh.parent as THREE.SpotLight
//                                 ).target.getWorldPosition(vec)
//                             );
//                         }
//                     }
//                 },
//             });
//
//             return () => {
//                 this.animationFrameStore.unregister(animationUuid);
//             };
//         })
//     );
//
//     ngOnInit() {
//         this.store.onCanvasReady(this.canvasStore.ready$, () => {
//             this.store.set(
//                 this.geometryParams$.pipe(
//                     map(
//                         ({
//                             angle,
//                             distance,
//                             radiusTop,
//                             radiusBottom,
//                             hasRadiusBottom,
//                             hasRadiusTop,
//                         }) => {
//                             const geometry = new THREE.CylinderGeometry(
//                                 hasRadiusTop ? radiusTop : 0.1,
//                                 hasRadiusBottom ? radiusBottom : angle * 7,
//                                 distance,
//                                 128,
//                                 64,
//                                 true
//                             );
//                             geometry.applyMatrix4(
//                                 new THREE.Matrix4().makeTranslation(
//                                     0,
//                                     -distance / 2,
//                                     0
//                                 )
//                             );
//                             geometry.applyMatrix4(
//                                 new THREE.Matrix4().makeRotationX(-Math.PI / 2)
//                             );
//                             return { geometry };
//                         }
//                     )
//                 )
//             );
//             this.zone.runOutsideAngular(() => {
//                 this.registerAnimation();
//             });
//         });
//     }
// }
//
// @NgModule({
//     declarations: [NgtSobaSpotLight],
//     exports: [NgtSobaSpotLight, NgtObjectInputsControllerModule],
//     imports: [
//         NgtSpotLightModule,
//         NgtMeshModule,
//         NgtSobaSpotLightMaterialModule,
//         CommonModule,
//         NgtColorPipeModule,
//         NgtVectorPipeModule,
//     ],
// })
// export class NgtSobaSpotLightModule {}
