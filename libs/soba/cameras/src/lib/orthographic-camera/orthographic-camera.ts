import {
    NgtCamera,
    NgtRef,
    provideObjectHosRef,
    tapEffect,
} from '@angular-three/core';
import {
    NgtOrthographicCamera,
    NgtOrthographicCameraModule,
} from '@angular-three/core/cameras';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    Input,
    NgModule,
    TemplateRef,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ng-template[ngt-soba-orthographic-camera-content]',
})
export class NgtSobaOrthographicCameraContent {
    constructor(
        public templateRef: TemplateRef<{
            camera: NgtRef<THREE.OrthographicCamera>;
        }>
    ) {}

    static ngTemplateContextGuard(
        dir: NgtSobaOrthographicCameraContent,
        ctx: any
    ): ctx is { camera: NgtRef<THREE.OrthographicCamera> } {
        return true;
    }
}

@Component({
    selector: 'ngt-soba-orthographic-camera',
    template: `
        <ngt-orthographic-camera
            [args]="instanceArgs"
            [left]="size.width / -2"
            [right]="size.width / 2"
            [top]="size.height / 2"
            [bottom]="size.height / -2"
            [near]="near"
            [far]="far"
            [ref]="instance"
            [attach]="attach"
            [skipParent]="skipParent"
            [noAttach]="noAttach"
            [name]="name"
            (ready)="ready.emit($event)"
            (beforeRender)="beforeRender.emit($event)"
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
                [ngTemplateOutletContext]="{ camera: instance }"
            ></ng-container>
        </ngt-orthographic-camera>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideObjectHosRef(
            NgtSobaOrthographicCamera,
            (camera) => camera.instance,
            (camera) => camera.parentRef
        ),
    ],
})
export class NgtSobaOrthographicCamera extends NgtOrthographicCamera {
    @Input() set makeDefault(makeDefault: boolean) {
        this.set({ makeDefault });
    }

    @Input() set manual(manual: boolean) {
        this.set({ manual });
    }

    @ContentChild(NgtSobaOrthographicCameraContent)
    content?: NgtSobaOrthographicCameraContent;

    get size() {
        return this.store.get((s) => s.size);
    }

    override get near() {
        return this.get((s) => s['near']);
    }

    override get far() {
        return this.get((s) => s['far']);
    }

    protected override get setOptionsTrigger$() {
        return this.select((s) => s['manual']);
    }

    protected override postSetOptions(camera: THREE.OrthographicCamera) {
        const manual = this.get((s) => s['manual']);
        if (!manual) {
            camera.updateProjectionMatrix();
        }
    }

    override ngOnInit() {
        super.ngOnInit();
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.setDefaultCamera(
                    this.select(
                        this.select((s) => s.instance),
                        this.select((s) => s.instance.value),
                        this.select((s) => s['makeDefault']),
                        this.store.select((s) => s.camera),
                        this.store.select((s) => s.cameraRef)
                    )
                );
            });
        });
    }

    private readonly setDefaultCamera = this.effect<{}>(
        tapEffect(() => {
            const camera = this.store.get((s) => s.camera);
            const cameraRef = this.store.get((s) => s.cameraRef);
            const makeDefault = this.get((s) => s['makeDefault']);

            if (this.instance.value && makeDefault) {
                const oldCamera = camera;
                const oldCameraRef = cameraRef;
                this.store.set({
                    camera: this.instance.value,
                    cameraRef: this.instance as NgtRef<NgtCamera>,
                });

                return () => {
                    this.store.set({
                        camera: oldCamera,
                        cameraRef: oldCameraRef,
                    });
                };
            }

            return;
        })
    );
}

@NgModule({
    declarations: [NgtSobaOrthographicCamera, NgtSobaOrthographicCameraContent],
    exports: [NgtSobaOrthographicCamera, NgtSobaOrthographicCameraContent],
    imports: [NgtOrthographicCameraModule, CommonModule],
})
export class NgtSobaOrthographicCameraModule {}
