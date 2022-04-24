import {
    BooleanInput,
    coerceBooleanProperty,
    NgtObjectPassThroughModule,
    provideObjectHosRef,
    Ref,
    startWithUndefined,
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
            camera: Ref<THREE.OrthographicCamera>;
        }>
    ) {}

    static ngTemplateContextGuard(
        dir: NgtSobaOrthographicCameraContent,
        ctx: any
    ): ctx is { camera: Ref<THREE.OrthographicCamera> } {
        return true;
    }
}

@Component({
    selector: 'ngt-soba-orthographic-camera',
    template: `
        <ngt-orthographic-camera
            *ngIf="cameraOptions$ | async as cameraOptions"
            [args]="cameraOptions"
            [ngtObjectInputs]="this"
            [ngtObjectOutputs]="this"
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
    @Input() set makeDefault(makeDefault: BooleanInput) {
        this.set({ makeDefault: coerceBooleanProperty(makeDefault) });
    }

    @Input() set manual(manual: BooleanInput) {
        this.set({ manual: coerceBooleanProperty(manual) });
    }

    @ContentChild(NgtSobaOrthographicCameraContent)
    content?: NgtSobaOrthographicCameraContent;

    override shouldPassThroughRef = false;

    readonly cameraOptions$ = this.select(
        this.store.select((s) => s.size),
        this.select((s) => s['near']).pipe(startWithUndefined()),
        this.select((s) => s['far']).pipe(startWithUndefined()),
        () => {
            const size = this.store.get((s) => s.size);
            const { near, far } = this.get();

            return [
                size.width / -2,
                size.width / 2,
                size.height / 2,
                size.height / -2,
                near,
                far,
            ];
        }
    );

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
                        this.instance$,
                        this.select((s) => s['makeDefault']),
                        this.store.select((s) => s.camera)
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
                this.store.set({ camera: this.instance.value });
                cameraRef.set(this.instance.value);

                return () => {
                    this.store.set({ camera: oldCamera });
                    cameraRef.set(oldCamera);
                };
            }

            return;
        })
    );
}

@NgModule({
    declarations: [NgtSobaOrthographicCamera, NgtSobaOrthographicCameraContent],
    exports: [NgtSobaOrthographicCamera, NgtSobaOrthographicCameraContent],
    imports: [
        NgtOrthographicCameraModule,
        CommonModule,
        NgtObjectPassThroughModule,
    ],
})
export class NgtSobaOrthographicCameraModule {}
