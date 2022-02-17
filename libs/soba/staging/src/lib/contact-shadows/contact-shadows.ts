import {
    createExtenderProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NgtAnimationFrameStore,
    NgtCanvasStore,
    NgtExtender,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtRadianPipeModule,
    NgtStore,
    startWithUndefined,
    tapEffect,
} from '@angular-three/core';
import { NgtOrthographicCameraModule } from '@angular-three/core/cameras';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule,
    NgZone,
    OnInit,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { HorizontalBlurShader, VerticalBlurShader } from 'three-stdlib';

interface NgtSobaContactShadowsState {
    group: THREE.Group;
    shadowCamera: THREE.OrthographicCamera;
    opacity: number;
    width: number;
    height: number;
    blur: number;
    far: number;
    smooth: boolean;
    resolution: number;
    frames: number;
    renderTarget: THREE.WebGLRenderTarget;
    renderTargetBlur: THREE.WebGLRenderTarget;
    planeGeometry: THREE.PlaneGeometry;
    depthMaterial: THREE.MeshDepthMaterial;
    blurPlane: THREE.Mesh;
    horizontalBlurMaterial: THREE.ShaderMaterial;
    verticalBlurMaterial: THREE.ShaderMaterial;
    scale?: number | [x: number, y: number];
}

@Component({
    selector: 'ngt-soba-contact-shadows',
    template: `
        <ngt-group
            *ngIf="vm$ | async as vm"
            (ready)="object = $event; store.set({ group: $event })"
            (animateReady)="
                animateReady.emit({
                    entity: $any($event.object),
                    state: $event.state
                })
            "
            [name]="objectInputsController.name"
            [position]="objectInputsController.position"
            [rotation]="objectInputsController.rotation || [90 | radian, 0, 0]"
            [quaternion]="objectInputsController.quaternion"
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
            <ngt-mesh
                [scale]="[1, -1, 1]"
                [rotation]="[-90 | radian, 0, 0]"
                [geometry]="vm.planeGeometry"
            >
                <ngt-mesh-basic-material
                    [parameters]="{
                        map: vm.renderTarget.texture,
                        opacity: vm.opacity,
                        transparent: true
                    }"
                ></ngt-mesh-basic-material>
            </ngt-mesh>

            <ngt-orthographic-camera
                (ready)="store.set({ shadowCamera: $event })"
                [args]="vm.orthographicArgs"
            ></ngt-orthographic-camera>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        NgtStore,
        createExtenderProvider(NgtSobaContactShadows),
    ],
})
export class NgtSobaContactShadows
    extends NgtExtender<THREE.Group>
    implements OnInit
{
    @Input() set opacity(opacity: number) {
        this.store.set({ opacity });
    }

    @Input() set width(width: number) {
        this.store.set({ width });
    }

    @Input() set height(height: number) {
        this.store.set({ height });
    }

    @Input() set blur(blur: number) {
        this.store.set({ blur });
    }

    @Input() set far(far: number) {
        this.store.set({ far });
    }

    @Input() set smooth(smooth: boolean) {
        this.store.set({ smooth });
    }

    @Input() set resolution(resolution: number) {
        this.store.set({ resolution });
    }

    @Input() set frames(frames: number) {
        this.store.set({ frames });
    }

    @Input() set scale(scale: number | [x: number, y: number]) {
        this.store.set({ scale });
    }

    constructor(
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        public store: NgtStore<NgtSobaContactShadowsState>,
        private zone: NgZone,
        private canvasStore: NgtCanvasStore,
        private animationFrameStore: NgtAnimationFrameStore
    ) {
        super();
        store.set({
            frames: Infinity,
            opacity: 1,
            width: 1,
            height: 1,
            blur: 1,
            far: 10,
            resolution: 256,
            smooth: true,
        });
    }

    readonly vm$ = this.store.select(
        this.store.select((s) => s.renderTarget),
        this.store.select((s) => s.planeGeometry),
        this.store.select((s) => s.opacity),
        this.store.select((s) => s.width),
        this.store.select((s) => s.height),
        this.store.select((s) => s.far),
        (renderTarget, planeGeometry, opacity, width, height, far) => ({
            renderTarget,
            planeGeometry,
            opacity,
            orthographicArgs: [
                -width / 2,
                width / 2,
                height / 2,
                -height / 2,
                0,
                far,
            ] as ConstructorParameters<typeof THREE.OrthographicCamera>,
        })
    );

    private count = 0;

    private scale$ = this.store
        .select((s) => s.scale)
        .pipe(startWithUndefined());

    private renderTargetParams$ = this.store.select(
        this.store.select((s) => s.resolution),
        this.scale$,
        this.store.select((s) => s.width),
        this.store.select((s) => s.height),
        (resolution, scale, width, height) => ({
            resolution,
            scale,
            width,
            height,
        })
    );

    private readonly updateWidthHeight = this.store.effect<
        NgtSobaContactShadowsState['scale']
    >(
        tap((scale) => {
            const [widthScale, heightScale] = Array.isArray(scale)
                ? scale
                : [scale ?? 1, scale ?? 1];
            this.store.set((state) => ({
                width: state.width * widthScale,
                height: state.width * heightScale,
            }));
        })
    );

    private readonly setRenderTarget = this.store.effect<
        Pick<
            NgtSobaContactShadowsState,
            'resolution' | 'scale' | 'width' | 'height'
        >
    >(
        tap(({ width, height, scale, resolution }) => {
            const renderTarget = new THREE.WebGLRenderTarget(
                resolution,
                resolution
            );
            const renderTargetBlur = new THREE.WebGLRenderTarget(
                resolution,
                resolution
            );
            renderTargetBlur.texture.generateMipmaps =
                renderTarget.texture.generateMipmaps = false;
            const planeGeometry = new THREE.PlaneBufferGeometry(
                width,
                height
            ).rotateX(Math.PI / 2) as THREE.PlaneGeometry;
            const blurPlane = new THREE.Mesh(planeGeometry);
            const depthMaterial = new THREE.MeshDepthMaterial();
            depthMaterial.depthTest = depthMaterial.depthWrite = false;
            depthMaterial.onBeforeCompile = (shader) =>
                (shader.fragmentShader = shader.fragmentShader.replace(
                    '1.0 - fragCoordZ ), opacity );',
                    '0.0 ), ( 1.0 - fragCoordZ ) * 1.0 );'
                ));
            const horizontalBlurMaterial = new THREE.ShaderMaterial(
                HorizontalBlurShader
            );
            const verticalBlurMaterial = new THREE.ShaderMaterial(
                VerticalBlurShader
            );
            verticalBlurMaterial.depthTest = horizontalBlurMaterial.depthTest =
                false;
            this.store.set({
                renderTarget,
                planeGeometry,
                depthMaterial,
                blurPlane,
                horizontalBlurMaterial,
                verticalBlurMaterial,
                renderTargetBlur,
            });
        })
    );

    private readonly registerAnimation = this.store.effect<void>(
        tapEffect(() => {
            const animationUuid = this.animationFrameStore.register({
                callback: () => {
                    const {
                        shadowCamera,
                        frames,
                        depthMaterial,
                        renderTarget,
                        blur,
                        smooth,
                    } = this.store.get();
                    const { scene, renderer } = this.canvasStore.get();
                    if (
                        shadowCamera &&
                        (frames === Infinity || this.count < frames)
                    ) {
                        const initialBackground = scene.background;
                        scene.background = null;
                        scene.overrideMaterial = depthMaterial;
                        renderer.setRenderTarget(renderTarget);
                        renderer.render(scene, shadowCamera);
                        scene.overrideMaterial = null;

                        this.blurShadows(blur);
                        if (smooth) this.blurShadows(blur * 0.4);

                        renderer.setRenderTarget(null);
                        scene.background = initialBackground;
                        this.count++;
                    }
                },
            });

            return () => {
                this.animationFrameStore.unregister(animationUuid);
            };
        })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onCanvasReady(this.canvasStore.ready$, () => {
                this.updateWidthHeight(this.scale$);
                this.setRenderTarget(this.renderTargetParams$);
                this.registerAnimation();
            });
        });
    }

    private blurShadows = (blur: number) => {
        const {
            blurPlane,
            horizontalBlurMaterial,
            verticalBlurMaterial,
            renderTarget,
            renderTargetBlur,
            shadowCamera,
        } = this.store.get();
        const renderer = this.canvasStore.get((s) => s.renderer);

        blurPlane.visible = true;

        blurPlane.material = horizontalBlurMaterial;
        horizontalBlurMaterial.uniforms['tDiffuse'].value =
            renderTarget.texture;
        horizontalBlurMaterial.uniforms['h'].value = (blur * 1) / 256;

        renderer.setRenderTarget(renderTargetBlur);
        renderer.render(blurPlane, shadowCamera);

        blurPlane.material = verticalBlurMaterial;
        verticalBlurMaterial.uniforms['tDiffuse'].value =
            renderTargetBlur.texture;
        verticalBlurMaterial.uniforms['v'].value = (blur * 1) / 256;

        renderer.setRenderTarget(renderTarget);
        renderer.render(blurPlane, shadowCamera);

        blurPlane.visible = false;
    };
}

@NgModule({
    declarations: [NgtSobaContactShadows],
    exports: [NgtSobaContactShadows, NgtObjectInputsControllerModule],
    imports: [
        NgtGroupModule,
        NgtMeshModule,
        NgtMeshBasicMaterialModule,
        NgtOrthographicCameraModule,
        NgtRadianPipeModule,
        CommonModule,
    ],
})
export class NgtSobaContactShadowsModule {}
