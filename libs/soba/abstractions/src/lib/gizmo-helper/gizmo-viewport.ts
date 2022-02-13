import {
    createExtenderProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NgtCanvasStore,
    NgtEvent,
    NgtExtender,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtRadianPipeModule,
    NgtStore,
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
    EventEmitter,
    Inject,
    Input,
    NgModule,
    NgZone,
    Output,
} from '@angular/core';
import { map } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaGizmoHelperStore } from './gizmo-helper.store';

@Component({
    selector: 'ngt-soba-gizmo-viewport',
    template: `
        <ngt-group
            (ready)="object = $event; object.scale.set(40, 40, 40)"
            (animateReady)="
                animateReady.emit({ entity: object, state: $event.state })
            "
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
            <ngt-soba-gizmo-axis
                [color]="axisColors[0]"
                [rotation]="[0, 0, 0]"
                [scale]="axisScale"
            ></ngt-soba-gizmo-axis>
            <ngt-soba-gizmo-axis
                [color]="axisColors[1]"
                [rotation]="[0, 0, 90 | radian]"
                [scale]="axisScale"
            ></ngt-soba-gizmo-axis>
            <ngt-soba-gizmo-axis
                [color]="axisColors[2]"
                [rotation]="[0, -90 | radian, 0]"
                [scale]="axisScale"
            ></ngt-soba-gizmo-axis>
            <ng-container *ngIf="!hideAxisHeads">
                <ng-container *ngIf="{ raycast: raycast$ | async } as vm">
                    <ngt-soba-gizmo-axis-head
                        [arcStyle]="axisColors[0]"
                        [position]="[1, 0, 0]"
                        [label]="labels[0]"
                        [font]="font"
                        [disabled]="disabled"
                        [labelColor]="labelColor"
                        [raycast]="vm.raycast"
                        [axisHeadScale]="axisHeadScale"
                    ></ngt-soba-gizmo-axis-head>
                    <ngt-soba-gizmo-axis-head
                        [arcStyle]="axisColors[1]"
                        [position]="[0, 1, 0]"
                        [label]="labels[1]"
                        [font]="font"
                        [disabled]="disabled"
                        [labelColor]="labelColor"
                        [raycast]="vm.raycast"
                        [axisHeadScale]="axisHeadScale"
                    ></ngt-soba-gizmo-axis-head>
                    <ngt-soba-gizmo-axis-head
                        [arcStyle]="axisColors[2]"
                        [position]="[0, 0, 1]"
                        [label]="labels[2]"
                        [font]="font"
                        [disabled]="disabled"
                        [labelColor]="labelColor"
                        [raycast]="vm.raycast"
                        [axisHeadScale]="axisHeadScale"
                    ></ngt-soba-gizmo-axis-head>

                    <ng-container *ngIf="!hideNegativeAxes">
                        <ngt-soba-gizmo-axis-head
                            [arcStyle]="axisColors[0]"
                            [position]="[-1, 0, 0]"
                            [font]="font"
                            [disabled]="disabled"
                            [labelColor]="labelColor"
                            [raycast]="vm.raycast"
                            [axisHeadScale]="axisHeadScale"
                        ></ngt-soba-gizmo-axis-head>
                        <ngt-soba-gizmo-axis-head
                            [arcStyle]="axisColors[1]"
                            [position]="[0, -1, 0]"
                            [font]="font"
                            [disabled]="disabled"
                            [labelColor]="labelColor"
                            [raycast]="vm.raycast"
                            [axisHeadScale]="axisHeadScale"
                        ></ngt-soba-gizmo-axis-head>
                        <ngt-soba-gizmo-axis-head
                            [arcStyle]="axisColors[2]"
                            [position]="[0, 0, -1]"
                            [font]="font"
                            [disabled]="disabled"
                            [labelColor]="labelColor"
                            [raycast]="vm.raycast"
                            [axisHeadScale]="axisHeadScale"
                        ></ngt-soba-gizmo-axis-head>
                    </ng-container>
                </ng-container>
            </ng-container>
            <ngt-ambient-light [intensity]="0.5"></ngt-ambient-light>
            <ngt-point-light
                [intensity]="0.5"
                [position]="[10, 10, 10]"
            ></ngt-point-light>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        createExtenderProvider(NgtSobaGizmoViewport),
    ],
})
export class NgtSobaGizmoViewport extends NgtExtender<THREE.Group> {
    @Input() axisColors: [string, string, string] = [
        '#ff3653',
        '#0adb50',
        '#2c8fdf',
    ];
    @Input() labels: [string, string, string] = ['X', 'Y', 'Z'];
    @Input() labelColor = '#000';
    @Input() font = '18px Inter var, Arial, sans-serif';
    @Input() axisHeadScale = 1;
    @Input() hideNegativeAxes = false;
    @Input() hideAxisHeads = false;
    @Input() disabled = false;
    @Input() axisScale?: [number, number, number];

    @Output() click = new EventEmitter<NgtEvent<PointerEvent>>();

    readonly raycast$ = this.gizmoHelperStore.select((s) => s.raycast);

    constructor(
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        private gizmoHelperStore: NgtSobaGizmoHelperStore
    ) {
        super();
    }
}

@Component({
    selector: 'ngt-soba-gizmo-axis[color][rotation]',
    template: `
        <ngt-group
            (ready)="object = $event"
            (animateReady)="
                animateReady.emit({ entity: object, state: $event.state })
            "
            [rotation]="rotation"
        >
            <ngt-mesh [position]="[0.4, 0, 0]">
                <ngt-box-geometry [args]="scale"></ngt-box-geometry>
                <ngt-mesh-basic-material
                    [parameters]="{ color, toneMapped: false }"
                ></ngt-mesh-basic-material>
            </ngt-mesh>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [createExtenderProvider(NgtSobaGizmoAxis)],
})
export class NgtSobaGizmoAxis extends NgtExtender<THREE.Group> {
    @Input() color!: string;
    @Input() rotation!: [number, number, number];

    @Input() set scale(v: [number, number, number] | undefined) {
        this.#scale = v || this.#scale;
    }

    get scale() {
        return this.#scale;
    }

    #scale: [number, number, number] = [0.8, 0.05, 0.05];
}

@Component({
    selector: 'ngt-soba-gizmo-axis-head',
    template: `
        <ng-container *ngIf="vm$ | async as vm">
            <ngt-sprite-material
                #spriteMaterial="ngtSpriteMaterial"
                [parameters]="{
                    map: vm.texture,
                    opacity: vm.opacity,
                    toneMapped: false,
                    alphaTest: 0.3
                }"
            ></ngt-sprite-material>
            <ngt-sprite
                (ready)="object = $event"
                (animateReady)="
                    animateReady.emit({ entity: object, state: $event.state })
                "
                (pointerover)="onAxisHeadPointerOver($event)"
                (pointerout)="onAxisHeadPointerOut($event)"
                (pointerdown)="onAxisHeadPointerDown($event)"
                [scale]="vm.scale"
                [material]="spriteMaterial.material"
                [name]="objectInputsController.name"
                [position]="objectInputsController.position"
                [rotation]="objectInputsController.rotation"
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
                (pointerenter)="
                    objectInputsController.pointerenter.emit($event)
                "
                (pointerleave)="
                    objectInputsController.pointerleave.emit($event)
                "
                (pointermove)="objectInputsController.pointermove.emit($event)"
                (pointermissed)="
                    objectInputsController.pointermissed.emit($event)
                "
                (pointercancel)="
                    objectInputsController.pointercancel.emit($event)
                "
                (wheel)="objectInputsController.wheel.emit($event)"
            ></ngt-sprite>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        NgtStore,
        createExtenderProvider(NgtSobaGizmoAxisHead),
    ],
})
export class NgtSobaGizmoAxisHead extends NgtExtender<THREE.Sprite> {
    @Input() set arcStyle(arcStyle: string) {
        this.store.set({ arcStyle });
    }

    @Input() set label(label: string) {
        this.store.set({ label });
    }

    @Input() set labelColor(labelColor: string) {
        this.store.set({ labelColor });
    }

    @Input() set axisHeadScale(axisHeadScale: number) {
        this.store.set({ axisHeadScale });
    }

    @Input() set disabled(disabled: boolean) {
        this.store.set({ disabled: disabled || false });
    }

    @Input() set font(font: string) {
        this.store.set({ font });
    }

    private changes$ = this.store.select(
        this.store.select((s) => s.arcStyle),
        this.store.select((s) => s.label),
        this.store.select((s) => s.labelColor),
        this.store.select((s) => s.font),
        (arcStyle, label, labelColor, font) => ({
            arcStyle,
            label,
            labelColor,
            font,
        })
    );

    readonly vm$ = this.store.select(
        this.store.select((s) => s.active),
        this.store.select((s) => s.label),
        this.store.select((s) => s.axisHeadScale),
        this.store.select((s) => s.texture),
        this.canvasStore.renderer$,
        (active, label, axisHeadScale, texture, renderer) => {
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy() || 1;
            return {
                texture,
                scale: (label ? 1 : 0.75) * (active ? 1.2 : 1) * axisHeadScale,
                opacity: label ? 1 : 0.75,
            };
        }
    );

    constructor(
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        @Inject(DOCUMENT) private document: Document,
        private gizmoViewport: NgtSobaGizmoViewport,
        private gizmoHelperStore: NgtSobaGizmoHelperStore,
        private zone: NgZone,
        private canvasStore: NgtCanvasStore,
        private store: NgtStore<{
            arcStyle: string;
            labelColor: string;
            axisHeadScale: number;
            disabled: boolean;
            font: string;
            texture: THREE.CanvasTexture;
            active: boolean;
            label: string;
        }>
    ) {
        super();
        this.store.set({
            label: '',
            active: false,
            disabled: false,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onCanvasReady(this.canvasStore.ready$, () => {
                this.store.set(
                    this.changes$.pipe(
                        map(({ label, labelColor, arcStyle, font }) => {
                            const canvas = document.createElement('canvas');
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

                            return { texture: new THREE.CanvasTexture(canvas) };
                        })
                    )
                );
            });
        });
    }

    onAxisHeadPointerOver($event: NgtEvent<PointerEvent>) {
        if (!this.store.get((s) => s.disabled)) {
            $event.stopPropagation();
            this.store.set({ active: true });
        }
    }

    onAxisHeadPointerOut($event: NgtEvent<PointerEvent>) {
        if (!this.store.get((s) => s.disabled)) {
            if (this.gizmoViewport.click.observed) {
                this.gizmoViewport.click.emit($event);
            } else {
                $event.stopPropagation();
                this.store.set({ active: false });
            }
        }
    }

    onAxisHeadPointerDown($event: NgtEvent<PointerEvent>) {
        if (!this.store.get((s) => s.disabled)) {
            $event.stopPropagation();
            this.gizmoHelperStore.tweenCamera($event.object.position);
        }
    }
}

@NgModule({
    declarations: [
        NgtSobaGizmoViewport,
        NgtSobaGizmoAxis,
        NgtSobaGizmoAxisHead,
    ],
    exports: [NgtSobaGizmoViewport, NgtObjectInputsControllerModule],
    imports: [
        CommonModule,
        NgtGroupModule,
        NgtMeshModule,
        NgtMeshBasicMaterialModule,
        NgtSpriteModule,
        NgtSpriteMaterialModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
        NgtBoxGeometryModule,
        NgtRadianPipeModule,
    ],
})
export class NgtSobaGizmoViewportModule {}
