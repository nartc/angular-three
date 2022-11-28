import { NgtInstance, NgtObservableInput, NgtRepeat, NgtThreeEvent, provideInstanceRef } from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshLambertMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { DOCUMENT } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import * as THREE from 'three';
import { SobaGizmoViewcubeInputs } from './gizmo-viewcube-inputs';

@Component({
    selector: 'ngt-soba-gizmo-viewcube-face-material[hover][index]',
    standalone: true,
    template: `
        <ngt-mesh-lambert-material
            [map]="texture$"
            [attach]="['material', instance.readKey('index')]"
            [color]="instance.readKey('hover') ? instance.readKey('hoverColor') : 'white'"
            [transparent]="true"
            [opacity]="instance.readKey('opacity')"
        ></ngt-mesh-lambert-material>
    `,
    imports: [NgtMeshLambertMaterial],
    hostDirectives: [{ directive: NgtInstance }],
    providers: [provideInstanceRef(SobaGizmoViewcubeFaceMaterial)],
})
export class SobaGizmoViewcubeFaceMaterial extends SobaGizmoViewcubeInputs {
    @Input() set hover(hover: NgtObservableInput<boolean>) {
        this.instance.write({ hover });
    }

    @Input() set index(index: NgtObservableInput<number>) {
        this.instance.write({ index });
    }

    private readonly __document__ = inject(DOCUMENT);

    readonly texture$ = this.instance.select(
        this.instance.select((s) => s['index']),
        this.instance.select((s) => s['faces']),
        this.instance.select((s) => s['font']),
        this.instance.select((s) => s['color']),
        this.instance.select((s) => s['textColor']),
        this.instance.select((s) => s['strokeColor']),
        () => {
            const gl = this.store.read((s) => s.gl);
            const { color, strokeColor, textColor, font, faces, index } = this.instance.read();
            const canvas = this.__document__.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const context = canvas.getContext('2d')!;
            context.fillStyle = color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = strokeColor;
            context.strokeRect(0, 0, canvas.width, canvas.height);
            context.font = font;
            context.textAlign = 'center';
            context.fillStyle = textColor;
            context.fillText(faces[index].toUpperCase(), 64, 76);
            const texture = new THREE.CanvasTexture(canvas);

            texture.encoding = gl.outputEncoding;
            texture.anisotropy = gl.capabilities.getMaxAnisotropy() || 1;

            return texture;
        },
        { debounce: true }
    );
}

@Component({
    selector: 'ngt-soba-gizmo-viewcube-face-cube',
    standalone: true,
    template: `
        <ngt-mesh
            [raycast]="raycast"
            (click)="onClick($event)"
            (pointerout)="onPointerOut($event)"
            (pointermove)="onPointerMove($event)"
        >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-soba-gizmo-viewcube-face-material
                *ngFor="let index; repeat: 6"
                [hover]="hover === index"
                [index]="index"
            ></ngt-soba-gizmo-viewcube-face-material>
        </ngt-mesh>
    `,
    imports: [NgtMesh, NgtBoxGeometry, SobaGizmoViewcubeFaceMaterial, NgtRepeat],
    hostDirectives: [{ directive: NgtInstance }],
    providers: [provideInstanceRef(SobaGizmoViewcubeFaceCube)],
})
export class SobaGizmoViewcubeFaceCube extends SobaGizmoViewcubeInputs {
    hover = -1;

    onClick($event: NgtThreeEvent<MouseEvent>) {
        if (this.viewcubeClick.observed) {
            this.viewcubeClick.emit($event);
        } else {
            $event.stopPropagation();
            this.gizmoHelper.tweenCamera($event.face!.normal);
        }
    }

    onPointerOut($event: NgtThreeEvent<PointerEvent>) {
        $event.stopPropagation();
        this.hover = -1;
    }

    onPointerMove($event: NgtThreeEvent<PointerEvent>) {
        $event.stopPropagation();
        this.hover = Math.floor(($event.faceIndex || 0) / 2);
    }
}
