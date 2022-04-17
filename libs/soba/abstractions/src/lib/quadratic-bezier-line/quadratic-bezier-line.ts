import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
    selector: 'ngt-soba-quadratic-bezier-line',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaQuadraticBezierLine {
    constructor() {
        console.warn(`<ngt-soba-quadratic-bezier-line> is being reworked!`);
    }
}

@NgModule({
    declarations: [NgtSobaQuadraticBezierLine],
    exports: [NgtSobaQuadraticBezierLine],
})
export class NgtSobaQuadraticBezierLineModule {}

// import {
//     createExtenderProvider,
//     createParentObjectProvider,
//     NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
//     NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
//     NgtExtender,
//     NgtObjectInputsController,
//     NgtObjectInputsControllerModule,
//     NgtStore,
//     NgtVector3,
// } from '@angular-three/core';
// import {
//     ChangeDetectionStrategy,
//     Component,
//     Inject,
//     Input,
//     NgModule,
//     NgZone,
//     OnInit,
// } from '@angular/core';
// import { tap } from 'rxjs';
// import * as THREE from 'three';
// import { Line2 } from 'three-stdlib';
// import {
//     NGT_SOBA_LINE_INPUTS_CONTROLLER_PROVIDER,
//     NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER,
//     NgtSobaLineInputsController,
//     NgtSobaLineModule,
// } from '../line/line';
//
// export interface NgtSobaQuadraticBezierLineState {
//     start: NgtVector3;
//     end: NgtVector3;
//     segments: number;
//     points: NgtVector3[];
//     curve: THREE.QuadraticBezierCurve3;
//     mid: NgtVector3 | null;
// }
//
// @Component({
//     selector: 'ngt-soba-quadratic-bezier-line[start][end]',
//     template: `
//         <ngt-soba-line
//             (ready)="onLineReady($any($event))"
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
//         NgtStore,
//         createExtenderProvider(NgtSobaQuadraticBezierLine),
//         createParentObjectProvider(
//             NgtSobaQuadraticBezierLine,
//             (line) => line.object
//         ),
//     ],
// })
// export class NgtSobaQuadraticBezierLine
//     extends NgtExtender<Line2>
//     implements OnInit
// {
//     @Input() set start(start: NgtVector3) {
//         this.store.set({ start });
//     }
//
//     @Input() set end(end: NgtVector3) {
//         this.store.set({ end });
//     }
//
//     @Input() set mid(mid: NgtVector3) {
//         this.store.set({ mid });
//     }
//
//     @Input() set segments(segments: number) {
//         this.store.set({ segments });
//     }
//
//     private v = new THREE.Vector3();
//
//     get points() {
//         return this.store.get((s) => s.points);
//     }
//
//     constructor(
//         @Inject(NGT_SOBA_LINE_INPUTS_WATCHED_CONTROLLER)
//         public sobaLineInputsController: NgtSobaLineInputsController,
//         @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
//         public objectInputsController: NgtObjectInputsController,
//         private store: NgtStore<NgtSobaQuadraticBezierLineState>,
//         private zone: NgZone
//     ) {
//         super();
//         this.store.set({
//             start: [0, 0, 0],
//             end: [0, 0, 0],
//             segments: 20,
//             mid: null,
//             curve: new THREE.QuadraticBezierCurve3(
//                 undefined as any,
//                 undefined as any,
//                 undefined as any
//             ),
//         });
//     }
//
//     private pointsParams$ = this.store.select(
//         this.store.select((s) => s.start),
//         this.store.select((s) => s.end),
//         this.store.select((s) => s.mid),
//         this.store.select((s) => s.segments),
//         (start, end, mid, segments) => ({ start, end, mid, segments })
//     );
//
//     private readonly setPoints = this.store.effect<
//         Omit<NgtSobaQuadraticBezierLineState, 'points' | 'curve'>
//     >(
//         tap(({ end, mid, segments, start }) => {
//             this.store.set({
//                 points: this.getPoints(start, end, mid, segments),
//             });
//         })
//     );
//
//     ngOnInit() {
//         this.zone.runOutsideAngular(() => {
//             this.setPoints(this.pointsParams$);
//         });
//     }
//
//     onLineReady(
//         line: Line2 & {
//             setPoints: (
//                 start: NgtVector3,
//                 end: NgtVector3,
//                 mid: NgtVector3
//             ) => void;
//         }
//     ) {
//         this.object = line;
//         line.setPoints = (start, end, mid) => {
//             const points = this.getPoints(start, end, mid);
//             if (line.geometry) {
//                 line.geometry.setPositions(
//                     // @ts-ignore
//                     points.map((p) => p.toArray()).flat()
//                 );
//             }
//         };
//     }
//
//     private getPoints(
//         start: NgtVector3,
//         end: NgtVector3,
//         mid: NgtVector3 | null,
//         segments = 20
//     ) {
//         const curve = this.store.get((s) => s.curve);
//         if (start instanceof THREE.Vector3) curve.v0.copy(start);
//         else curve.v0.set(...(start as [number, number, number]));
//         if (end instanceof THREE.Vector3) curve.v2.copy(end);
//         else curve.v2.set(...(end as [number, number, number]));
//         if (mid instanceof THREE.Vector3) {
//             curve.v1.copy(mid);
//         } else {
//             curve.v1.copy(
//                 curve.v0
//                     .clone()
//                     .add(curve.v2.clone().sub(curve.v0))
//                     .add(this.v.set(0, curve.v0.y - curve.v2.y, 0))
//             );
//         }
//         return curve.getPoints(segments);
//     }
// }
//
// @NgModule({
//     declarations: [NgtSobaQuadraticBezierLine],
//     exports: [
//         NgtSobaQuadraticBezierLine,
//         NgtSobaLineModule,
//         NgtObjectInputsControllerModule,
//     ],
//     imports: [NgtSobaLineModule],
// })
// export class NgtSobaQuadraticBezierLineModule {}
