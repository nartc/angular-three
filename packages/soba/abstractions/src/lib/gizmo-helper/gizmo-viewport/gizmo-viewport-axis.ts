import {
    checkNeedsUpdate,
    NgtArgs,
    NgtCompound,
    NgtObjectCompound,
    NgtObservableInput,
    NgtStore,
    NgtThreeEvent,
    provideInstanceRef,
} from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterial, NgtSpriteMaterial } from '@angular-three/core/materials';
import { NgtGroup, NgtMesh, NgtSprite } from '@angular-three/core/objects';
import { DOCUMENT } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../../common';
import { SobaGizmoHelper } from '../gizmo-helper';

@Component({
    selector: 'ngt-soba-gizmo-viewport-axis',
    standalone: true,
    template: `
        <ngt-group [rotation]="rotation!">
            <ngt-mesh [position]="[0.4, 0, 0]">
                <ngt-box-geometry *args="scale!"></ngt-box-geometry>
                <ngt-mesh-basic-material [color]="color!" [toneMapped]="false"></ngt-mesh-basic-material>
            </ngt-mesh>
        </ngt-group>
    `,
    imports: [NgtGroup, NgtMesh, NgtBoxGeometry, NgtMeshBasicMaterial, NgtArgs],
})
export class SobaGizmoViewportAxis {
    @Input() color?: THREE.ColorRepresentation;
    @Input() rotation?: [number, number, number];
    @Input() scale?: [number, number, number];
}

@Component({
    selector: 'ngt-soba-gizmo-viewport-axis-head',
    standalone: true,
    template: `
        <ngt-sprite
            [objectCompound]="this"
            [scale]="scale$"
            [raycast]="gizmoRaycast"
            (pointerout)="onPointerOut($event)"
            (pointerover)="onPointerOver($event)"
            (pointerdown)="onPointerDown($event)"
        >
            <ngt-sprite-material
                [alphaTest]="0.3"
                [toneMapped]="false"
                [map]="texture$"
                [opacity]="opacity$"
            ></ngt-sprite-material>
        </ngt-sprite>
    `,
    imports: [NgtSprite, NgtSpriteMaterial, NgtObjectCompound],
    providers: [provideInstanceRef(SobaGizmoViewportAxisHead, { compound: true })],
    inputs: [...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaGizmoViewportAxisHead extends NgtCompound<NgtSprite> {
    [x: string]: any;
    @Input() set arcStyle(arcStyle: NgtObservableInput<string>) {
        this.write({ arcStyle });
    }

    @Input() set label(label: NgtObservableInput<string>) {
        this.write({ label });
    }

    @Input() set labelColor(labelColor: NgtObservableInput<string>) {
        this.write({ labelColor });
    }

    @Input() set axisHeadScale(axisHeadScale: NgtObservableInput<number>) {
        this.write({ axisHeadScale });
    }

    @Input() set disabled(disabled: NgtObservableInput<boolean>) {
        this.write({ disabled });
    }

    @Input() set font(font: NgtObservableInput<string>) {
        this.write({ font });
    }

    private readonly store = inject(NgtStore);
    private readonly document = inject(DOCUMENT);
    private readonly sobaGizmoHelper = inject(SobaGizmoHelper, { optional: true });

    get gizmoHelper() {
        return this.sobaGizmoHelper as SobaGizmoHelper;
    }

    get gizmoRaycast() {
        return this.gizmoHelper.gizmoRaycast;
    }

    override get useOnHost(): (keyof NgtSprite | string)[] {
        return [...super.useOnHost, 'scale', 'raycast'];
    }

    readonly texture$ = this.select(
        this.select((s) => s['arcStyle']),
        this.select((s) => s['label']),
        this.select((s) => s['labelColor']),
        this.select((s) => s['font']),
        (arcStyle, label, labelColor, font) => {
            const gl = this.store.read((s) => s.gl);

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

            checkNeedsUpdate(texture);

            return texture;
        },
        { debounce: true }
    );

    readonly opacity$ = this.select(
        this.select((s) => s['label']),
        (label) => (label ? 1 : 0.75),
        { debounce: true }
    );

    readonly scale$ = this.select(
        this.select((s) => s['active']),
        this.select((s) => s['label']),
        this.select((s) => s['axisHeadScale']),
        (active, label, axisHeadScale) => (label ? 1 : 0.75) * (active ? 1.2 : 1) * axisHeadScale,
        { debounce: true }
    );

    override initialize() {
        super.initialize();
        this.write({ axisHeadScale: 1, active: false, label: '' });
    }

    onPointerOut($event: NgtThreeEvent<PointerEvent>) {
        if (!this.disabled) {
            if (this.ngtInstance?.click.observed) {
                this.ngtInstance?.click.emit($event);
            } else {
                $event.stopPropagation();
                this.write({ active: false });
            }
        }
    }

    onPointerOver($event: NgtThreeEvent<PointerEvent>) {
        if (!this.disabled) {
            $event.stopPropagation();
            this.write({ active: true });
        }
    }

    onPointerDown($event: NgtThreeEvent<PointerEvent>) {
        if (!this.disabled) {
            this.gizmoHelper.tweenCamera($event.object.position);
            $event.stopPropagation();
        }
    }
}
