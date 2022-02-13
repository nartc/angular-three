import {
    AnyFunction,
    createExtenderProvider,
    createHostParentObjectProvider,
    createParentObjectProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_PARENT_OBJECT,
    NgtCoreModule,
    NgtExtender,
    NgtObjectInputsControllerModule,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtSobaOrthographicCameraModule } from '@angular-three/soba/cameras';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule,
    OnInit,
    Optional,
    SkipSelf,
} from '@angular/core';
import * as THREE from 'three';
import { NgtSobaGizmoHelperStore } from './gizmo-helper.store';

@Component({
    selector: 'ngt-soba-gizmo-helper',
    template: `
        <ng-container *ngIf="virtualScene$ | async as virtualScene">
            <ngt-group
                *ngIf="gizmoProps$ | async as gizmoProps"
                (ready)="onGizmoReady($event)"
                (animateReady)="
                    animateReady.emit({ entity: object, state: $event.state })
                "
                [appendTo]="virtualScene"
                [position]="[gizmoProps.x, gizmoProps.y, 0]"
                [name]="gizmoProps.objectInputsController!.name"
                [rotation]="gizmoProps.objectInputsController!.rotation"
                [quaternion]="gizmoProps.objectInputsController!.quaternion"
                [scale]="gizmoProps.objectInputsController!.scale"
                [color]="gizmoProps.objectInputsController!.color"
                [userData]="gizmoProps.objectInputsController!.userData"
                [castShadow]="gizmoProps.objectInputsController!.castShadow"
                [receiveShadow]="
                    gizmoProps.objectInputsController!.receiveShadow
                "
                [visible]="gizmoProps.objectInputsController!.visible"
                [matrixAutoUpdate]="
                    gizmoProps.objectInputsController!.matrixAutoUpdate
                "
                [dispose]="gizmoProps.objectInputsController!.dispose"
                [raycast]="gizmoProps.objectInputsController!.raycast"
                [appendMode]="gizmoProps.objectInputsController!.appendMode"
                (click)="gizmoProps.objectInputsController!.click.emit($event)"
                (contextmenu)="
                    gizmoProps.objectInputsController!.contextmenu.emit($event)
                "
                (dblclick)="
                    gizmoProps.objectInputsController!.dblclick.emit($event)
                "
                (pointerup)="
                    gizmoProps.objectInputsController!.pointerup.emit($event)
                "
                (pointerdown)="
                    gizmoProps.objectInputsController!.pointerdown.emit($event)
                "
                (pointerover)="
                    gizmoProps.objectInputsController!.pointerover.emit($event)
                "
                (pointerout)="
                    gizmoProps.objectInputsController!.pointerout.emit($event)
                "
                (pointerenter)="
                    gizmoProps.objectInputsController!.pointerenter.emit($event)
                "
                (pointerleave)="
                    gizmoProps.objectInputsController!.pointerleave.emit($event)
                "
                (pointermove)="
                    gizmoProps.objectInputsController!.pointermove.emit($event)
                "
                (pointermissed)="
                    gizmoProps.objectInputsController!.pointermissed.emit(
                        $event
                    )
                "
                (pointercancel)="
                    gizmoProps.objectInputsController!.pointercancel.emit(
                        $event
                    )
                "
                (wheel)="gizmoProps.objectInputsController!.wheel.emit($event)"
            >
                <ng-container
                    *ngIf="object"
                    [ngTemplateOutlet]="contentTemplate"
                ></ng-container>
            </ngt-group>
            <ngt-soba-orthographic-camera
                [appendTo]="virtualScene"
                [makeDefault]="false"
                [position]="[0, 0, 200]"
                (ready)="onCameraReady($event)"
            ></ngt-soba-orthographic-camera>
            <ng-template #contentTemplate>
                <ng-content></ng-content>
            </ng-template>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        NgtSobaGizmoHelperStore,
        createExtenderProvider(NgtSobaGizmoHelper),
        createParentObjectProvider(
            NgtSobaGizmoHelper,
            (helper) => helper.object
        ),
        createHostParentObjectProvider(NgtSobaGizmoHelper),
    ],
})
export class NgtSobaGizmoHelper
    extends NgtExtender<THREE.Group>
    implements OnInit
{
    @Input() set alignment(
        alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
    ) {
        this.sobaGizmoHelperStore.set({ alignment });
    }

    @Input() set margin(margin: [number, number]) {
        this.sobaGizmoHelperStore.set({ margin });
    }

    @Input() set renderPriority(renderPriority: number) {
        this.sobaGizmoHelperStore.set({ renderPriority });
    }

    readonly gizmoProps$ = this.sobaGizmoHelperStore.gizmoProps$;
    readonly virtualScene$ = this.sobaGizmoHelperStore.virtualScene$;

    constructor(
        private sobaGizmoHelperStore: NgtSobaGizmoHelperStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_PARENT_OBJECT)
        public parentObjectFn: AnyFunction
    ) {
        super();
    }

    ngOnInit() {
        this.sobaGizmoHelperStore.init();
    }

    onCameraReady(camera: THREE.OrthographicCamera) {
        this.sobaGizmoHelperStore.set({ virtualCamera: camera });
    }

    onGizmoReady(gizmo: THREE.Group) {
        this.sobaGizmoHelperStore.set({ gizmo });
        this.object = gizmo;
    }
}

@NgModule({
    declarations: [NgtSobaGizmoHelper],
    exports: [NgtSobaGizmoHelper, NgtObjectInputsControllerModule],
    imports: [
        NgtCoreModule,
        NgtGroupModule,
        NgtSobaOrthographicCameraModule,
        CommonModule,
    ],
})
export class NgtSobaGizmoHelperModule {}
