import { NgtInstance, provideInstanceRef } from '@angular-three/core';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtGroup } from '@angular-three/core/objects';
import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { cornerDimensions, corners, edgeDimensions, edges } from './gizmo-viewcube-constants';
import { SobaGizmoViewcubeEdgeCube } from './gizmo-viewcube-edge';
import { SobaGizmoViewcubeFaceCube } from './gizmo-viewcube-face';
import { SobaGizmoViewcubeInputs } from './gizmo-viewcube-inputs';

@Component({
    selector: 'ngt-soba-gizmo-viewcube',
    standalone: true,
    template: `
        <ngt-group [scale]="60">
            <ngt-soba-gizmo-viewcube-face-cube
                [color]="instance.readKey('color')"
                [faces]="instance.readKey('faces')"
                [font]="instance.readKey('font')"
                [hoverColor]="instance.readKey('hoverColor')"
                [opacity]="instance.readKey('opacity')"
                [strokeColor]="instance.readKey('strokeColor')"
                [textColor]="instance.readKey('textColor')"
            ></ngt-soba-gizmo-viewcube-face-cube>

            <ngt-soba-gizmo-viewcube-edge-cube
                *ngFor="let edge of edges; index as i"
                [position]="edge"
                [dimensions]="edgeDimensions[i]"
                [color]="instance.readKey('color')"
                [faces]="instance.readKey('faces')"
                [font]="instance.readKey('font')"
                [hoverColor]="instance.readKey('hoverColor')"
                [opacity]="instance.readKey('opacity')"
                [strokeColor]="instance.readKey('strokeColor')"
                [textColor]="instance.readKey('textColor')"
            ></ngt-soba-gizmo-viewcube-edge-cube>

            <ngt-soba-gizmo-viewcube-edge-cube
                *ngFor="let corner of corners"
                [position]="corner"
                [dimensions]="cornerDimensions"
                [color]="instance.readKey('color')"
                [faces]="instance.readKey('faces')"
                [font]="instance.readKey('font')"
                [hoverColor]="instance.readKey('hoverColor')"
                [opacity]="instance.readKey('opacity')"
                [strokeColor]="instance.readKey('strokeColor')"
                [textColor]="instance.readKey('textColor')"
            ></ngt-soba-gizmo-viewcube-edge-cube>

            <ngt-ambient-light [intensity]="0.5"></ngt-ambient-light>
            <ngt-point-light [position]="10" [intensity]="0.5"></ngt-point-light>
        </ngt-group>
    `,
    hostDirectives: [{ directive: NgtInstance }],
    providers: [provideInstanceRef(SobaGizmoViewcube)],
    imports: [NgtGroup, NgtAmbientLight, NgtPointLight, SobaGizmoViewcubeFaceCube, SobaGizmoViewcubeEdgeCube, NgForOf],
})
export class SobaGizmoViewcube extends SobaGizmoViewcubeInputs {
    readonly edges = edges;
    readonly edgeDimensions = edgeDimensions;

    readonly corners = corners;
    readonly cornerDimensions = cornerDimensions;
}
