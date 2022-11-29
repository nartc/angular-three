import {
    NgtCompound,
    NgtObjectCompound,
    NgtObservableInput,
    NgtRadianPipe,
    provideInstanceRef,
} from '@angular-three/core';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtGroup } from '@angular-three/core/objects';
import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../../common';
import { SobaGizmoViewportAxis, SobaGizmoViewportAxisHead } from './gizmo-viewport-axis';

@Component({
    selector: 'ngt-soba-gizmo-viewport',
    standalone: true,
    template: `
        <ngt-group [objectCompound]="this" [scale]="40">
            <ngt-soba-gizmo-viewport-axis
                [color]="readKey('axisColors')[0]"
                [rotation]="[0, 0, 0]"
                [scale]="readKey('axisScale')"
            ></ngt-soba-gizmo-viewport-axis>
            <ngt-soba-gizmo-viewport-axis
                [color]="readKey('axisColors')[1]"
                [rotation]="[0, 0, 90 | radian]"
                [scale]="readKey('axisScale')"
            ></ngt-soba-gizmo-viewport-axis>
            <ngt-soba-gizmo-viewport-axis
                [color]="readKey('axisColors')[2]"
                [rotation]="[0, -90 | radian, 0]"
                [scale]="readKey('axisScale')"
            ></ngt-soba-gizmo-viewport-axis>

            <ng-container *ngIf="!readKey('hideAxisHeads')">
                <ngt-soba-gizmo-viewport-axis-head
                    [arcStyle]="readKey('axisColors')[0]"
                    [position]="[1, 0, 0]"
                    [label]="readKey('labels')[0]"
                    [labelColor]="readKey('labelColor')"
                    [font]="readKey('font')"
                    [disabled]="readKey('disabled')"
                    [axisHeadScale]="readKey('axisHeadScale')"
                ></ngt-soba-gizmo-viewport-axis-head>
                <ngt-soba-gizmo-viewport-axis-head
                    [arcStyle]="readKey('axisColors')[1]"
                    [position]="[0, 1, 0]"
                    [label]="readKey('labels')[1]"
                    [labelColor]="readKey('labelColor')"
                    [font]="readKey('font')"
                    [disabled]="readKey('disabled')"
                    [axisHeadScale]="readKey('axisHeadScale')"
                ></ngt-soba-gizmo-viewport-axis-head>
                <ngt-soba-gizmo-viewport-axis-head
                    [arcStyle]="readKey('axisColors')[2]"
                    [position]="[0, 0, 1]"
                    [label]="readKey('labels')[2]"
                    [labelColor]="readKey('labelColor')"
                    [font]="readKey('font')"
                    [disabled]="readKey('disabled')"
                    [axisHeadScale]="readKey('axisHeadScale')"
                ></ngt-soba-gizmo-viewport-axis-head>
                <ng-container *ngIf="!readKey('hideNegativeAxes')">
                    <ngt-soba-gizmo-viewport-axis-head
                        [arcStyle]="readKey('axisColors')[0]"
                        [position]="[-1, 0, 0]"
                        [labelColor]="readKey('labelColor')"
                        [font]="readKey('font')"
                        [disabled]="readKey('disabled')"
                        [axisHeadScale]="readKey('axisHeadScale')"
                    ></ngt-soba-gizmo-viewport-axis-head>
                    <ngt-soba-gizmo-viewport-axis-head
                        [arcStyle]="readKey('axisColors')[1]"
                        [position]="[0, -1, 0]"
                        [labelColor]="readKey('labelColor')"
                        [font]="readKey('font')"
                        [disabled]="readKey('disabled')"
                        [axisHeadScale]="readKey('axisHeadScale')"
                    ></ngt-soba-gizmo-viewport-axis-head>
                    <ngt-soba-gizmo-viewport-axis-head
                        [arcStyle]="readKey('axisColors')[2]"
                        [position]="[0, 0, -1]"
                        [labelColor]="readKey('labelColor')"
                        [font]="readKey('font')"
                        [disabled]="readKey('disabled')"
                        [axisHeadScale]="readKey('axisHeadScale')"
                    ></ngt-soba-gizmo-viewport-axis-head>
                </ng-container>
            </ng-container>

            <ngt-ambient-light [intensity]="0.5"></ngt-ambient-light>
            <ngt-point-light [position]="10" [intensity]="0.5"></ngt-point-light>
        </ngt-group>
    `,
    imports: [
        NgtGroup,
        SobaGizmoViewportAxis,
        SobaGizmoViewportAxisHead,
        NgtRadianPipe,
        NgtAmbientLight,
        NgtPointLight,
        NgIf,
        NgtObjectCompound,
    ],
    providers: [provideInstanceRef(SobaGizmoViewport, { compound: true })],
    inputs: [...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaGizmoViewport extends NgtCompound<NgtGroup> {
    @Input() set axisColors(axisColors: NgtObservableInput<[string, string, string]>) {
        this.write({ axisColors });
    }

    @Input() set axisScale(axisScale: NgtObservableInput<[number, number, number]>) {
        this.write({ axisScale });
    }

    @Input() set labels(labels: NgtObservableInput<[string, string, string]>) {
        this.write({ labels });
    }

    @Input() set axisHeadScale(axisHeadScale: NgtObservableInput<number>) {
        this.write({ axisHeadScale });
    }

    @Input() set labelColor(labelColor: NgtObservableInput<string>) {
        this.write({ labelColor });
    }

    @Input() set hideNegativeAxes(hideNegativeAxes: NgtObservableInput<boolean>) {
        this.write({ hideNegativeAxes });
    }

    @Input() set hideAxisHeads(hideAxisHeads: NgtObservableInput<boolean>) {
        this.write({ hideAxisHeads });
    }

    @Input() set disabled(disabled: NgtObservableInput<boolean>) {
        this.write({ disabled });
    }

    @Input() set font(font: NgtObservableInput<string>) {
        this.write({ font });
    }

    override get useOnHost(): (keyof NgtGroup | string)[] {
        return [...super.useOnHost, 'scale'];
    }

    override initialize() {
        super.initialize();
        this.write({
            font: '18px Inter var, Arial, sans-serif',
            axisColors: ['#ff3653', '#0adb50', '#2c8fdf'],
            axisScale: [0.8, 0.05, 0.05],
            axisHeadScale: 1,
            labels: ['X', 'Y', 'Z'],
            labelColor: '#000',
        });
    }
}
