import {
    AnyFunction,
    createExtenderProvider,
    createHostParentObjectProvider,
    createParentObjectProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NGT_PARENT_OBJECT,
    NgtExtender,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtRender,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule,
    Optional,
    SkipSelf,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-soba-billboard',
    template: `
        <ngt-group
            (ready)="object = $event"
            (animateReady)="onGroupAnimate($event.object, $event.state)"
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
            <ng-container
                *ngIf="object"
                [ngTemplateOutlet]="contentTemplate"
            ></ng-container>
        </ngt-group>
        <ng-template #contentTemplate>
            <ng-content></ng-content>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        createExtenderProvider(NgtSobaBillboard),
        createParentObjectProvider(
            NgtSobaBillboard,
            (billboard) => billboard.object
        ),
        createHostParentObjectProvider(NgtSobaBillboard),
    ],
})
export class NgtSobaBillboard extends NgtExtender<THREE.Group> {
    @Input() follow = true;
    @Input() lockX = false;
    @Input() lockY = false;
    @Input() lockZ = false;

    constructor(
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        @Optional()
        @SkipSelf()
        @Inject(NGT_PARENT_OBJECT)
        public parentObjectFn: AnyFunction
    ) {
        super();
    }

    onGroupAnimate(group: THREE.Object3D, state: NgtRender) {
        if (!this.follow) return;

        this.animateReady.emit({ entity: group as THREE.Group, state });

        // save previous rotation in case we're locking an axis
        const prevRotation = group.rotation.clone();

        // always face the camera
        group.quaternion.copy(state.camera.quaternion);

        // readjust any axis that is locked
        if (this.lockX) group.rotation.x = prevRotation.x;
        if (this.lockY) group.rotation.y = prevRotation.y;
        if (this.lockZ) group.rotation.z = prevRotation.z;
    }
}

@NgModule({
    declarations: [NgtSobaBillboard],
    exports: [NgtSobaBillboard, NgtObjectInputsControllerModule],
    imports: [NgtGroupModule, CommonModule],
})
export class NgtSobaBillboardModule {}
