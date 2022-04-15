import {
    NgtObjectInputs,
    NgtRenderState,
    provideInstanceWrapperFactory,
    provideObjectWrapperFactory,
    Ref,
} from '@angular-three/core';
import { NgtGroup, NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    EventEmitter,
    Input,
    NgModule,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ng-template[ngt-soba-billboard-content]',
})
export class NgtSobaBillboardContent {
    constructor(
        public templateRef: TemplateRef<{ billboard: Ref<THREE.Group> }>
    ) {}

    static ngTemplateContextGuard(
        dir: NgtSobaBillboardContent,
        ctx: any
    ): ctx is { billboard: Ref<THREE.Group> } {
        return true;
    }
}

@Component({
    selector: 'ngt-soba-billboard',
    template: `
        <ngt-group
            #ngtGroup
            (ready)="ready.emit($event)"
            (beforeRender)="onBeforeRender($event)"
            [name]="name"
            [position]="position"
            [rotation]="rotation"
            [quaternion]="quaternion"
            [scale]="scale"
            [color]="color"
            [userData]="userData"
            [castShadow]="castShadow"
            [receiveShadow]="receiveShadow"
            [visible]="visible"
            [matrixAutoUpdate]="matrixAutoUpdate"
            [dispose]="dispose"
            [raycast]="raycast"
            [appendMode]="appendMode"
            [appendTo]="appendTo"
            (click)="click.emit($event)"
            (contextmenu)="contextmenu.emit($event)"
            (dblclick)="dblclick.emit($event)"
            (pointerup)="pointerup.emit($event)"
            (pointerdown)="pointerdown.emit($event)"
            (pointerover)="pointerover.emit($event)"
            (pointerout)="pointerout.emit($event)"
            (pointerenter)="pointerenter.emit($event)"
            (pointerleave)="pointerleave.emit($event)"
            (pointermove)="pointermove.emit($event)"
            (pointermissed)="pointermissed.emit($event)"
            (pointercancel)="pointercancel.emit($event)"
            (wheel)="wheel.emit($event)"
        >
            <ng-container
                *ngIf="content"
                [ngTemplateOutlet]="content.templateRef"
                [ngTemplateOutletContext]="{ billboard: ngtGroup.instance }"
            ></ng-container>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceWrapperFactory(
            NgtSobaBillboard,
            (billboard) => billboard.group.instance.value,
            (billboard) => billboard.parentInstanceFactory
        ),
        provideObjectWrapperFactory(
            NgtSobaBillboard,
            (billboard) => billboard.group.instance.value,
            (billboard) => billboard.parentObjectFactory
        ),
    ],
})
export class NgtSobaBillboard extends NgtObjectInputs<THREE.Group> {
    @Input() follow = true;
    @Input() lockX = false;
    @Input() lockY = false;
    @Input() lockZ = false;

    @ContentChild(NgtSobaBillboardContent) content?: NgtSobaBillboardContent;

    @ViewChild(NgtGroup, { static: true }) group!: NgtGroup;

    @Output() beforeRender = new EventEmitter<{
        state: NgtRenderState;
        object: THREE.Group;
    }>();

    onBeforeRender({
        state: { camera },
        object,
    }: {
        state: NgtRenderState;
        object: THREE.Group;
    }) {
        if (!this.follow) return;

        // save previous rotation in case we're locking an axis
        const prevRotation = object.rotation.clone();

        // always face the camera
        object.quaternion.copy(camera.quaternion);

        // readjust any axis that is locked
        if (this.lockX) object.rotation.x = prevRotation.x;
        if (this.lockY) object.rotation.y = prevRotation.y;
        if (this.lockZ) object.rotation.z = prevRotation.z;
    }
}

@NgModule({
    declarations: [NgtSobaBillboard, NgtSobaBillboardContent],
    exports: [NgtSobaBillboard, NgtSobaBillboardContent],
    imports: [NgtGroupModule, CommonModule],
})
export class NgtSobaBillboardModule {}
