import { make, NgtArgs, NgtInstance, NgtThreeEvent, NgtVector3, provideInstanceRef } from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';
import { SobaGizmoViewcubeInputs } from './gizmo-viewcube-inputs';

@Component({
    selector: 'ngt-soba-gizmo-viewcube-edge-cube[dimensions][position]',
    standalone: true,
    template: `
        <ngt-mesh
            [scale]="1.01"
            [position]="instance.readKey('position')"
            [raycast]="raycast"
            (click)="onClick($event)"
            (pointerout)="onPointerOut($event)"
            (pointerover)="onPointerOver($event)"
        >
            <ngt-box-geometry *args="instance.readKey('dimensions')"></ngt-box-geometry>
            <ngt-mesh-basic-material
                [transparent]="true"
                [opacity]="0.6"
                [color]="instance.readKey('hover') ? instance.readKey('hoverColor') : 'white'"
                [visible]="instance.readKey('hover')"
            ></ngt-mesh-basic-material>
        </ngt-mesh>
    `,
    imports: [NgtMesh, NgtBoxGeometry, NgtMeshBasicMaterial, NgtArgs],
    hostDirectives: [{ directive: NgtInstance }],
    providers: [provideInstanceRef(SobaGizmoViewcubeEdgeCube)],
})
export class SobaGizmoViewcubeEdgeCube extends SobaGizmoViewcubeInputs {
    @Input() set dimensions(dimensions: [number, number, number]) {
        this.instance.write({ dimensions });
    }

    @Input() set position(position: NgtVector3) {
        this.instance.write({ position });
    }

    hover = false;

    onClick($event: NgtThreeEvent<MouseEvent>) {
        if (this.viewcubeClick.observed) {
            this.viewcubeClick.emit($event);
        } else {
            $event.stopPropagation();
            this.gizmoHelper.tweenCamera(make(THREE.Vector3, this.position));
        }
    }

    onPointerOut($event: NgtThreeEvent<PointerEvent>) {
        $event.stopPropagation();
        this.hover = false;
    }

    onPointerOver($event: NgtThreeEvent<PointerEvent>) {
        $event.stopPropagation();
        this.hover = true;
    }
}
