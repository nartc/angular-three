import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'ngt-soba-camera-shake',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaCameraShake {
    constructor() {
        console.warn(`<ngt-soba-camera-shake> is being reworked`);
    }
}

@NgModule({
    declarations: [NgtSobaCameraShake],
    exports: [NgtSobaCameraShake],
})
export class NgtSobaCameraShakeModule {}

// import {
//     NgtAnimationFrameStore,
//     NgtCanvasStore,
//     NgtStore,
//     tapEffect,
// } from '@angular-three/core';
// import { Directive, Input, NgModule, NgZone, OnInit } from '@angular/core';
// import { map, Observable } from 'rxjs';
// import * as THREE from 'three';
// import { SimplexNoise } from 'three-stdlib';
//
// type ControlsProto = {
//     update(): void;
//     target: THREE.Vector3;
//     addEventListener: (
//         event: string,
//         callback: (event: unknown) => void
//     ) => void;
//     removeEventListener: (
//         event: string,
//         callback: (event: unknown) => void
//     ) => void;
// };
//
// export interface NgtSobaCameraShakeState {
//     intensity: number;
//     intensityRef: number;
//     decay: boolean;
//     decayRate: number;
//     maxYaw: number;
//     maxPitch: number;
//     maxRoll: number;
//     yawFrequency: number;
//     pitchFrequency: number;
//     rollFrequency: number;
//     // TODO: in a new major this should be the only means of consuming controls, the
//     // controls prop can then be removed!
//     controls: ControlsProto | null;
// }
//
// @Directive({
//     selector: 'ngt-soba-camera-shake',
//     exportAs: 'ngtSobaCameraShake',
// })
// export class NgtSobaCameraShake
//     extends NgtStore<NgtSobaCameraShakeState>
//     implements OnInit
// {
//     @Input() set intensity(intensity: number) {
//         this.set({ intensity });
//     }
//
//     @Input() set decay(decay: boolean) {
//         this.set({ decay });
//     }
//
//     @Input() set decayRate(decayRate: number) {
//         this.set({ decayRate });
//     }
//
//     @Input() set maxYaw(maxYaw: number) {
//         this.set({ maxYaw });
//     }
//
//     @Input() set maxPitch(maxPitch: number) {
//         this.set({ maxPitch });
//     }
//
//     @Input() set maxRoll(maxRoll: number) {
//         this.set({ maxRoll });
//     }
//
//     @Input() set yawFrequency(yawFrequency: number) {
//         this.set({ yawFrequency });
//     }
//
//     @Input() set pitchFrequency(pitchFrequency: number) {
//         this.set({ pitchFrequency });
//     }
//
//     @Input() set rollFrequency(rollFrequency: number) {
//         this.set({ rollFrequency });
//     }
//
//     @Input() set controls(controls: ControlsProto) {
//         this.set({ controls });
//     }
//
//     private yawNoise = new SimplexNoise();
//     private pitchNoise = new SimplexNoise();
//     private rollNoise = new SimplexNoise();
//
//     private initialRotation!: THREE.Euler;
//
//     constructor(
//         private zone: NgZone,
//         private canvasStore: NgtCanvasStore,
//         private animationFrameStore: NgtAnimationFrameStore
//     ) {
//         super();
//         this.set({
//             intensity: 1,
//             decay: false,
//             decayRate: 0.65,
//             maxYaw: 0.1,
//             maxPitch: 0.1,
//             maxRoll: 0.1,
//             yawFrequency: 0.1,
//             pitchFrequency: 0.1,
//             rollFrequency: 0.1,
//             controls: null,
//         });
//         this.set(
//             this.select((s) => s.intensity).pipe(
//                 map((intensity) => ({
//                     intensityRef:
//                         NgtSobaCameraShake.constraintIntensity(intensity),
//                 }))
//             )
//         );
//     }
//
//     private eventParams$ = this.select(
//         this.select((s) => s.controls),
//         this.canvasStore.select(
//             (s) => s.controls
//         ) as unknown as Observable<ControlsProto>,
//         (controls, defaultControls) => ({ controls, defaultControls })
//     );
//
//     private readonly configureChangeEvents = this.effect<{
//         controls: ControlsProto | null;
//         defaultControls: ControlsProto;
//     }>(
//         tapEffect(({ controls, defaultControls }) => {
//             const currentControls = defaultControls || controls;
//             const callback = () => {
//                 this.initialRotation = this.canvasStore
//                     .get((s) => s.camera)
//                     .rotation.clone();
//             };
//             if (currentControls) {
//                 currentControls.addEventListener('change', callback);
//             }
//
//             return () => {
//                 if (currentControls) {
//                     currentControls.removeEventListener('change', callback);
//                 }
//             };
//         })
//     );
//
//     private readonly registerAnimation = this.effect<void>(
//         tapEffect(() => {
//             const camera = this.canvasStore.get((s) => s.camera);
//             this.initialRotation = camera.rotation.clone();
//             const animationUuid = this.animationFrameStore.register({
//                 callback: ({ clock, delta }) => {
//                     const {
//                         intensityRef,
//                         maxYaw,
//                         maxPitch,
//                         maxRoll,
//                         yawFrequency,
//                         pitchFrequency,
//                         rollFrequency,
//                         decay,
//                         decayRate,
//                     } = this.get();
//                     const shake = Math.pow(intensityRef, 2);
//                     const yaw =
//                         maxYaw *
//                         shake *
//                         this.yawNoise.noise(
//                             clock.elapsedTime * yawFrequency,
//                             1
//                         );
//                     const pitch =
//                         maxPitch *
//                         shake *
//                         this.pitchNoise.noise(
//                             clock.elapsedTime * pitchFrequency,
//                             1
//                         );
//                     const roll =
//                         maxRoll *
//                         shake *
//                         this.rollNoise.noise(
//                             clock.elapsedTime * rollFrequency,
//                             1
//                         );
//
//                     camera.rotation.set(
//                         this.initialRotation.x + pitch,
//                         this.initialRotation.y + yaw,
//                         this.initialRotation.z + roll
//                     );
//
//                     if (decay && intensityRef > 0) {
//                         this.set({
//                             intensity: intensityRef - decayRate * delta,
//                         });
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
//         this.zone.runOutsideAngular(() => {
//             this.onCanvasReady(this.canvasStore.ready$, () => {
//                 this.configureChangeEvents(this.eventParams$);
//                 this.registerAnimation();
//             });
//         });
//     }
//
//     getIntensity() {
//         return this.get((s) => s.intensityRef);
//     }
//
//     setIntensity(intensity: number) {
//         this.set({ intensity });
//     }
//
//     private static constraintIntensity(intensity: number) {
//         if (intensity < 0 || intensity > 1) {
//             return intensity < 0 ? 0 : 1;
//         }
//         return intensity;
//     }
// }
//
// @NgModule({
//     declarations: [NgtSobaCameraShake],
//     exports: [NgtSobaCameraShake],
// })
// export class NgtSobaCameraShakeModule {}
