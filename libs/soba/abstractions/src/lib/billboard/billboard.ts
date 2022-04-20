import {
    BooleanInput,
    coerceBooleanProperty,
    NgtObjectInputs,
    NgtRef,
    NgtRenderState,
    provideObjectHosRef,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
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
} from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ng-template[ngt-soba-billboard-content]',
})
export class NgtSobaBillboardContent {
    constructor(
        public templateRef: TemplateRef<{ billboard: NgtRef<THREE.Group> }>
    ) {}

    static ngTemplateContextGuard(
        dir: NgtSobaBillboardContent,
        ctx: any
    ): ctx is { billboard: NgtRef<THREE.Group> } {
        return true;
    }
}

@Component({
    selector: 'ngt-soba-billboard',
    template: `
        <ngt-group
            (ready)="ready.emit($event)"
            (beforeRender)="onBeforeRender($event)"
            [ref]="instance"
            [attach]="attach"
            [skipParent]="skipParent"
            [noAttach]="noAttach"
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
                [ngTemplateOutletContext]="{ billboard: instance }"
            ></ng-container>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideObjectHosRef(
            NgtSobaBillboard,
            (billboard) => billboard.instance,
            (billboard) => billboard.parentRef
        ),
    ],
})
export class NgtSobaBillboard extends NgtObjectInputs<THREE.Group> {
    @Input() set follow(value: BooleanInput) {
        this.set({ follow: coerceBooleanProperty(value) });
    }

    @Input() set lockX(value: BooleanInput) {
        this.set({ lockX: coerceBooleanProperty(value) });
    }

    @Input() set lockY(value: BooleanInput) {
        this.set({ lockY: coerceBooleanProperty(value) });
    }

    @Input() set lockZ(value: BooleanInput) {
        this.set({ lockZ: coerceBooleanProperty(value) });
    }

    @ContentChild(NgtSobaBillboardContent) content?: NgtSobaBillboardContent;

    @Output() beforeRender = new EventEmitter<{
        state: NgtRenderState;
        object: THREE.Group;
    }>();

    protected override preInit() {
        this.set((state) => ({
            follow: state['follow'] || true,
            lockX: state['lockX'] || false,
            lockY: state['lockY'] || false,
            lockZ: state['lockZ'] || false,
        }));
    }

    onBeforeRender({
        state: { camera },
        object,
    }: {
        state: NgtRenderState;
        object: THREE.Group;
    }) {
        const { follow, lockX, lockY, lockZ } = this.get();

        if (!follow) return;

        // save previous rotation in case we're locking an axis
        const prevRotation = object.rotation.clone();

        // always face the camera
        object.quaternion.copy(camera.quaternion);

        // readjust any axis that is locked
        if (lockX) object.rotation.x = prevRotation.x;
        if (lockY) object.rotation.y = prevRotation.y;
        if (lockZ) object.rotation.z = prevRotation.z;
    }
}

@NgModule({
    declarations: [NgtSobaBillboard, NgtSobaBillboardContent],
    exports: [NgtSobaBillboard, NgtSobaBillboardContent],
    imports: [NgtGroupModule, CommonModule],
})
export class NgtSobaBillboardModule {}
