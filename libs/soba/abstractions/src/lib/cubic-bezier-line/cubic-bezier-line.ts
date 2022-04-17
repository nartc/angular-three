import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'ngt-soba-cubic-bezier-line',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaCubicBezierLine {
    constructor() {
        console.warn(`<ngt-soba-cubic-bezier-line> is being reworked!`);
    }
}

@NgModule({
    declarations: [NgtSobaCubicBezierLine],
    exports: [NgtSobaCubicBezierLine],
})
export class NgtSobaCubicBezierLineModule {}

// import {
//     createExtenderProvider,
//     createParentObjectProvider,
//     NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//     NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
//     NgtExtender,
//     NgtObjectInputsController,
//     NgtObjectInputsControllerModule,
//     NgtVector3,
// } from '@angular-three/core';
// import {
//     ChangeDetectionStrategy,
//     Component,
//     Inject,
//     Input,
//     NgModule,
//     NgZone,
//     OnChanges,
//     OnInit,
//     SimpleChanges,
// } from '@angular/core';
// import * as THREE from 'three';
// import { Line2 } from 'three-stdlib';
// import {
//     NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
//     NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER,
//     NgtSobaLineInputsController,
//     NgtSobaLineModule,
// } from '../line/line';
//
// @Component({
//     selector: 'ngt-soba-cubic-bezier-line',
//     template: `
//         <ngt-soba-line
//             (ready)="object = $event"
//             (animateReady)="
//                 animateReady.emit({
//                     entity: $event.object,
//                     state: $event.state
//                 })
//             "
//             [points]="points"
//             [parameters]="sobaLineInputsController.parameters"
//             [dashed]="sobaLineInputsController.dashed"
//             [lineWidth]="sobaLineInputsController.lineWidth"
//             [vertexColors]="sobaLineInputsController.vertexColors"
//             [name]="objectInputsController.name"
//             [position]="objectInputsController.position"
//             [rotation]="objectInputsController.rotation"
//             [quaternion]="objectInputsController.quaternion"
//             [scale]="objectInputsController.scale"
//             [color]="objectInputsController.color!"
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
//         ></ngt-soba-line>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     providers: [
//         NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
//         NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//         createExtenderProvider(NgtSobaCubicBezierLine),
//         createParentObjectProvider(
//             NgtSobaCubicBezierLine,
//             (line) => line.object
//         ),
//     ],
// })
// export class NgtSobaCubicBezierLine
//     extends NgtExtender<Line2>
//     implements OnInit, OnChanges
// {
//     @Input() start!: NgtVector3;
//     @Input() end!: NgtVector3;
//     @Input() midA!: NgtVector3;
//     @Input() midB!: NgtVector3;
//     @Input() segments?: number = 20;
//
//     points!: Array<NgtVector3>;
//
//     constructor(
//         @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
//         public objectInputsController: NgtObjectInputsController,
//         @Inject(NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER)
//         public sobaLineInputsController: NgtSobaLineInputsController,
//         private zone: NgZone
//     ) {
//         super();
//     }
//
//     ngOnChanges(changes: SimpleChanges) {
//         if (
//             changes['start'] ||
//             changes['end'] ||
//             changes['midA'] ||
//             changes['midB'] ||
//             changes['segments']
//         ) {
//             this.buildPoints();
//         }
//     }
//
//     ngOnInit() {
//         if (!this.points) {
//             this.buildPoints();
//         }
//     }
//
//     private buildPoints() {
//         this.zone.runOutsideAngular(() => {
//             const startV =
//                 this.start instanceof THREE.Vector3
//                     ? this.start
//                     : new THREE.Vector3(...(this.start as number[]));
//             const endV =
//                 this.end instanceof THREE.Vector3
//                     ? this.end
//                     : new THREE.Vector3(...(this.end as number[]));
//             const midAV =
//                 this.midA instanceof THREE.Vector3
//                     ? this.midA
//                     : new THREE.Vector3(...(this.midA as number[]));
//             const midBV =
//                 this.midB instanceof THREE.Vector3
//                     ? this.midB
//                     : new THREE.Vector3(...(this.midB as number[]));
//             this.zone.run(() => {
//                 this.points = new THREE.CubicBezierCurve3(
//                     startV,
//                     midAV,
//                     midBV,
//                     endV
//                 ).getPoints(this.segments);
//             });
//         });
//     }
// }
//
// @NgModule({
//     declarations: [NgtSobaCubicBezierLine],
//     exports: [
//         NgtSobaCubicBezierLine,
//         NgtSobaLineModule,
//         NgtObjectInputsControllerModule,
//     ],
//     imports: [NgtSobaLineModule],
// })
// export class NgtSobaCubicBezierLineModule {}
