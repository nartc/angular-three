import { extend, NgtThreeEvent } from '@angular-three/core';
import { NgFor } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { AmbientLight, Group, PointLight } from 'three';
import { cornerDimensions, corners, edgeDimensions, edges } from './constants';
import { NgtsGizmoViewcubeEdgeCube } from './gizmo-viewcube-edge';
import { NgtsGizmoViewcubeFaceCube } from './gizmo-viewcube-face';
import { NgtsGizmoViewcubeInputs } from './gizmo-viewcube-inputs';

extend({ Group, AmbientLight, PointLight });

@Component({
    selector: 'ngts-gizmo-viewcube',
    standalone: true,
    template: `
        <ngt-group scale="60">
            <ngts-gizmo-viewcube-face-cube
                [font]="get('font')"
                [color]="get('color')"
                [opacity]="get('opacity')"
                [hoverColor]="get('hoverColor')"
                [textColor]="get('textColor')"
                [strokeColor]="get('strokeColor')"
                [faces]="get('faces')"
                [clickEmitter]="clicked"
            />

            <ngts-gizmo-viewcube-edge-cube
                *ngFor="let edge of edges; let i = index"
                [position]="edge"
                [dimensions]="edgeDimensions[i]"
                [font]="get('font')"
                [color]="get('color')"
                [opacity]="get('opacity')"
                [hoverColor]="get('hoverColor')"
                [textColor]="get('textColor')"
                [strokeColor]="get('strokeColor')"
                [faces]="get('faces')"
                [clickEmitter]="clicked"
            />

            <ngts-gizmo-viewcube-edge-cube
                *ngFor="let corner of corners"
                [position]="corner"
                [dimensions]="cornerDimensions"
                [font]="get('font')"
                [color]="get('color')"
                [opacity]="get('opacity')"
                [hoverColor]="get('hoverColor')"
                [textColor]="get('textColor')"
                [strokeColor]="get('strokeColor')"
                [faces]="get('faces')"
                [clickEmitter]="clicked"
            />

            <ngt-ambient-light intensity="0.5" />
            <ngt-point-light position="10" intensity="0.5" />
        </ngt-group>
    `,
    imports: [NgtsGizmoViewcubeEdgeCube, NgtsGizmoViewcubeFaceCube, NgFor],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsGizmoViewcube extends NgtsGizmoViewcubeInputs {
    readonly edges = edges;
    readonly edgeDimensions = edgeDimensions;

    readonly corners = corners;
    readonly cornerDimensions = cornerDimensions;

    @Input() set font(font: string) {
        this.set({ font: font === undefined ? this.get('font') : font });
    }

    @Input() set color(color: string) {
        this.set({ color: color === undefined ? this.get('color') : color });
    }

    @Output() clicked = new EventEmitter<NgtThreeEvent<MouseEvent>>();
}
