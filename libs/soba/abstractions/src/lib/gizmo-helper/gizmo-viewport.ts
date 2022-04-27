import {
    AnyFunction,
    BooleanInput,
    coerceBooleanProperty,
    coerceNumberProperty,
    NGT_OBJECT_HOST_REF,
    NGT_OBJECT_REF,
    NgtEvent,
    NgtInstance,
    NgtObjectInputs,
    NgtObjectPassThroughModule,
    NgtRadianPipeModule,
    NgtStore,
    NgtTriple,
    NumberInput,
    provideObjectHosRef,
    Ref,
    startWithUndefined,
} from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import {
    NgtAmbientLightModule,
    NgtPointLightModule,
} from '@angular-three/core/lights';
import {
    NgtMeshBasicMaterialModule,
    NgtSpriteMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSpriteModule } from '@angular-three/core/sprites';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    Inject,
    Input,
    NgModule,
    NgZone,
    Optional,
    Self,
    SkipSelf,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaGizmoHelper } from './gizmo-helper';

@Component({
    selector: 'ngt-soba-gizmo-viewport-axis[color][rotation]',
    template: `
        <ngt-group [rotation]="rotation">
            <ngt-mesh [position]="[0.4, 0, 0]">
                <ngt-box-geometry [args]="scale"></ngt-box-geometry>
                <ngt-mesh-basic-material
                    [color]="color"
                    toneMapped="false"
                ></ngt-mesh-basic-material>
            </ngt-mesh>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaGizmoViewportAxis extends NgtInstance<THREE.Group> {
    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
    }
    get color() {
        return this.get((s) => s['color']);
    }

    @Input() set rotation(rotation: NgtTriple) {
        this.set({ rotation });
    }
    get rotation() {
        return this.get((s) => s['rotation']);
    }

    @Input() set scale(scale: NgtTriple) {
        this.set({ scale });
    }
    get scale() {
        return this.get((s) => s['scale']);
    }

    protected override preInit() {
        super.preInit();
        this.set((state) => ({
            scale: state['scale'] ?? [0.8, 0.05, 0.05],
        }));
    }
}

@Component({
    selector:
        'ngt-soba-gizmo-viewport-axis-head[arcStyle][labelColor][font], ngt-soba-gizmo-viewport-axis-head[ngtSobaGizmoViewportAxisHead]',
    template: `
        <ngt-sprite
            [ngtObjectInputs]="this"
            [ngtObjectOutputs]="this"
            [scale]="(scale$ | async)!"
            [raycast]="raycast"
            (pointerout)="onPointerOut($event)"
            (pointerover)="onPointerOver($event)"
            (pointerdown)="onPointerDown($event)"
        >
            <ngt-sprite-material
                [map]="texture$ | async"
                [opacity]="opacity$ | async"
                alphaTest="0.3"
                toneMapped="false"
            ></ngt-sprite-material>
        </ngt-sprite>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideObjectHosRef(
            NgtSobaGizmoViewportAxisHead,
            (axisHead) => axisHead.instance,
            (axisHead) => axisHead.parentRef
        ),
    ],
})
export class NgtSobaGizmoViewportAxisHead extends NgtObjectInputs<THREE.Sprite> {
    @Input() set arcStyle(arcStyle: string) {
        this.set({ arcStyle });
    }

    @Input() set label(label: string) {
        this.set({ label });
    }

    @Input() set labelColor(labelColor: string) {
        this.set({ labelColor });
    }

    @Input() set axisHeadScale(axisHeadScale: NumberInput) {
        this.set({ axisHeadScale: coerceNumberProperty(axisHeadScale) });
    }

    @Input() set disabled(disabled: BooleanInput) {
        this.set({ disabled: coerceBooleanProperty(disabled) });
    }

    @Input() set font(font: string) {
        this.set({ font });
    }

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_OBJECT_REF)
        parentObjectRef: AnyFunction<Ref<THREE.Object3D>>,
        @Optional()
        @SkipSelf()
        @Inject(NGT_OBJECT_HOST_REF)
        parentObjectHostRef: AnyFunction<Ref<THREE.Object3D>>,
        @Inject(DOCUMENT) private document: Document,
        @Optional() private gizmoHelper: NgtSobaGizmoHelper
    ) {
        if (!gizmoHelper) {
            throw new Error(
                `<ngt-soba-gizmo-viewport> can only be used in <ngt-soba-gizmo-helper>`
            );
        }
        super(zone, store, parentObjectRef, parentObjectHostRef);
    }

    override get raycast() {
        return this.gizmoHelper.get((s) => s.raycast);
    }

    protected override preInit() {
        super.preInit();
        this.set((state) => ({
            axisHeadScale: state['axisHeadScale'] ?? 1,
            active: false,
        }));
    }

    readonly texture$ = this.select(
        this.select((s) => s['arcStyle']),
        this.select((s) => s['label']).pipe(startWithUndefined()),
        this.select((s) => s['labelColor']),
        this.select((s) => s['font']),
        (arcStyle, label, labelColor, font) => {
            const gl = this.store.get((s) => s.gl);

            const canvas = this.document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;

            const context = canvas.getContext('2d')!;
            context.beginPath();
            context.arc(32, 32, 16, 0, 2 * Math.PI);
            context.closePath();
            context.fillStyle = arcStyle;
            context.fill();

            if (label) {
                context.font = font;
                context.textAlign = 'center';
                context.fillStyle = labelColor;
                context.fillText(label, 32, 41);
            }
            const texture = new THREE.CanvasTexture(canvas);

            texture.encoding = gl.outputEncoding;
            texture.anisotropy = gl.capabilities.getMaxAnisotropy() || 1;

            return texture;
        }
    );

    readonly opacity$ = this.select(
        this.select((s) => s['label']).pipe(startWithUndefined()),
        (label) => (label ? 1 : 0.75)
    );

    readonly scale$ = this.select(
        this.select((s) => s['active']),
        this.select((s) => s['label']).pipe(startWithUndefined()),
        this.select((s) => s['axisHeadScale']),
        (active, label, axisHeadScale) =>
            (label ? 1 : 0.75) * (active ? 1.2 : 1) * axisHeadScale
    );

    onPointerOut($event: NgtEvent<PointerEvent>) {
        if (!this.disabled) {
            if (this.click.observed) {
                this.click.emit($event);
            } else {
                $event.stopPropagation();
                this.set({ active: false });
            }
        }
    }

    onPointerOver($event: NgtEvent<PointerEvent>) {
        if (!this.disabled) {
            $event.stopPropagation();
            this.set({ active: true });
        }
    }

    onPointerDown($event: NgtEvent<PointerEvent>) {
        if (!this.disabled) {
            this.gizmoHelper.tweenCamera($event.object.position);
            $event.stopPropagation();
        }
    }
}

@Component({
    selector: 'ngt-soba-gizmo-viewport',
    template: `
        <ngt-group
            [ngtObjectOutputs]="this"
            [ngtObjectInputs]="this"
            [scale]="40"
        >
            <ngt-soba-gizmo-viewport-axis
                [color]="axisColors[0]"
                [rotation]="[0, 0, 0]"
                [scale]="axisScale"
            ></ngt-soba-gizmo-viewport-axis>
            <ngt-soba-gizmo-viewport-axis
                [color]="axisColors[1]"
                [rotation]="[0, 0, 90 | radian]"
                [scale]="axisScale"
            ></ngt-soba-gizmo-viewport-axis>
            <ngt-soba-gizmo-viewport-axis
                [color]="axisColors[2]"
                [rotation]="[0, -90 | radian, 0]"
                [scale]="axisScale"
            ></ngt-soba-gizmo-viewport-axis>

            <ng-container *ngIf="!hideAxisHeads">
                <ngt-soba-gizmo-viewport-axis-head
                    [arcStyle]="axisColors[0]"
                    [position]="[1, 0, 0]"
                    [label]="labels[0]"
                    [ngtSobaGizmoViewportAxisHead]="this"
                ></ngt-soba-gizmo-viewport-axis-head>
                <ngt-soba-gizmo-viewport-axis-head
                    [arcStyle]="axisColors[1]"
                    [position]="[0, 1, 0]"
                    [label]="labels[1]"
                    [ngtSobaGizmoViewportAxisHead]="this"
                ></ngt-soba-gizmo-viewport-axis-head>
                <ngt-soba-gizmo-viewport-axis-head
                    [arcStyle]="axisColors[2]"
                    [position]="[0, 0, 1]"
                    [label]="labels[2]"
                    [ngtSobaGizmoViewportAxisHead]="this"
                ></ngt-soba-gizmo-viewport-axis-head>
                <ng-container *ngIf="!hideNegativeAxes">
                    <ngt-soba-gizmo-viewport-axis-head
                        [arcStyle]="axisColors[0]"
                        [position]="[-1, 0, 0]"
                        [ngtSobaGizmoViewportAxisHead]="this"
                    ></ngt-soba-gizmo-viewport-axis-head>
                    <ngt-soba-gizmo-viewport-axis-head
                        [arcStyle]="axisColors[1]"
                        [position]="[0, -1, 0]"
                        [ngtSobaGizmoViewportAxisHead]="this"
                    ></ngt-soba-gizmo-viewport-axis-head>
                    <ngt-soba-gizmo-viewport-axis-head
                        [arcStyle]="axisColors[2]"
                        [position]="[0, 0, -1]"
                        [ngtSobaGizmoViewportAxisHead]="this"
                    ></ngt-soba-gizmo-viewport-axis-head>
                </ng-container>
            </ng-container>

            <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
            <ngt-point-light [position]="10" intensity="0.5"></ngt-point-light>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideObjectHosRef(
            NgtSobaGizmoViewport,
            (viewport) => viewport.instance,
            (viewport) => viewport.parentRef
        ),
    ],
})
export class NgtSobaGizmoViewport extends NgtObjectInputs<THREE.Group> {
    @Input() set axisColors(axisColors: [string, string, string]) {
        this.set({ axisColors });
    }
    get axisColors() {
        return this.get((s) => s['axisColors']);
    }

    @Input() set axisScale(axisScale: NgtTriple) {
        this.set({ axisScale });
    }
    get axisScale() {
        return this.get((s) => s['axisScale']);
    }

    @Input() set labels(labels: [string, string, string]) {
        this.set({ labels });
    }
    get labels() {
        return this.get((s) => s['labels']);
    }

    @Input() set axisHeadScale(axisHeadScale: NumberInput) {
        this.set({ axisHeadScale: coerceNumberProperty(axisHeadScale) });
    }
    get axisHeadScale() {
        return this.get((s) => s['axisHeadScale']);
    }

    @Input() set labelColor(labelColor: string) {
        this.set({ labelColor });
    }
    get labelColor() {
        return this.get((s) => s['labelColor']);
    }

    @Input() set hideNegativeAxes(hideNegativeAxes: BooleanInput) {
        this.set({ hideNegativeAxes: coerceBooleanProperty(hideNegativeAxes) });
    }
    get hideNegativeAxes() {
        return this.get((s) => s['hideNegativeAxes']);
    }

    @Input() set hideAxisHeads(hideAxisHeads: BooleanInput) {
        this.set({ hideAxisHeads: coerceBooleanProperty(hideAxisHeads) });
    }
    get hideAxisHeads() {
        return this.get((s) => s['hideAxisHeads']);
    }

    @Input() set disabled(disabled: BooleanInput) {
        this.set({ disabled: coerceBooleanProperty(disabled) });
    }
    get disabled() {
        return this.get((s) => s['disabled']);
    }

    @Input() set font(font: string) {
        this.set({ font });
    }
    get font() {
        return this.get((s) => s['font']);
    }

    protected override preInit() {
        super.preInit();
        this.set((state) => ({
            font: state['font'] ?? '18px Inter var, Arial, sans-serif',
            axisColors: state['axisColors'] ?? [
                '#ff3653',
                '#0adb50',
                '#2c8fdf',
            ],
            axisHeadScale: state['axisHeadScale'] ?? 1,
            labels: state['labels'] ?? ['X', 'Y', 'Z'],
            labelColor: state['labelColor'] ?? '#000',
        }));
    }
}

@Directive({
    selector: '[ngtSobaGizmoViewportAxisHead]',
})
export class NgtSobaGizmoViewportAxisHeadPassThrough {
    @Input() set ngtSobaGizmoViewportAxisHead(wrapper: unknown) {
        this.assertWrapper(wrapper);

        wrapper
            .select(
                wrapper
                    .select((s) => s['labelColor'])
                    .pipe(startWithUndefined()),
                wrapper.select((s) => s['font']).pipe(startWithUndefined()),
                wrapper.select((s) => s['disabled']).pipe(startWithUndefined()),
                wrapper
                    .select((s) => s['axisHeadScale'])
                    .pipe(startWithUndefined())
            )
            .pipe(takeUntil(wrapper.destroy$))
            .subscribe(() => {
                this.axisHead.labelColor = wrapper.labelColor;
                this.axisHead.font = wrapper.font;
                this.axisHead.disabled = wrapper.disabled;
                this.axisHead.axisHeadScale = wrapper.axisHeadScale;
            });

        if (wrapper.click.observed) {
            this.axisHead.click
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.click.emit.bind(wrapper.click));
        }
    }

    constructor(@Self() private axisHead: NgtSobaGizmoViewportAxisHead) {}

    private assertWrapper(
        wrapper: unknown
    ): asserts wrapper is NgtSobaGizmoViewport {
        if (!(wrapper instanceof NgtSobaGizmoViewport)) {
            throw new Error('wrapper must be NgtSobaGizmoViewport');
        }
    }
}

@NgModule({
    declarations: [
        NgtSobaGizmoViewport,
        NgtSobaGizmoViewportAxis,
        NgtSobaGizmoViewportAxisHead,
        NgtSobaGizmoViewportAxisHeadPassThrough,
    ],
    exports: [NgtSobaGizmoViewport],
    imports: [
        CommonModule,
        NgtGroupModule,
        NgtMeshModule,
        NgtBoxGeometryModule,
        NgtMeshBasicMaterialModule,
        NgtSpriteModule,
        NgtObjectPassThroughModule,
        NgtSpriteMaterialModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
        NgtRadianPipeModule,
    ],
})
export class NgtSobaGizmoViewportModule {}
