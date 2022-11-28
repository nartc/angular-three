import {
    injectInstance,
    NgtInstance,
    NgtObservableInput,
    NgtRadianPipe,
    NgtWrapper,
    provideInstanceRef,
} from '@angular-three/core';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtGroup } from '@angular-three/core/objects';
import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../../common';
import { SobaGizmoViewportAxis, SobaGizmoViewportAxisHead } from './gizmo-viewport-axis';

@Component({
    selector: 'ngt-soba-gizmo-viewport',
    standalone: true,
    template: `
        <ngt-group *wrapper="this" [scale]="40">
            <ngt-soba-gizmo-viewport-axis
                [color]="instance.readKey('axisColors')[0]"
                [rotation]="[0, 0, 0]"
                [scale]="instance.readKey('axisScale')"
            ></ngt-soba-gizmo-viewport-axis>
            <ngt-soba-gizmo-viewport-axis
                [color]="instance.readKey('axisColors')[1]"
                [rotation]="[0, 0, 90 | radian]"
                [scale]="instance.readKey('axisScale')"
            ></ngt-soba-gizmo-viewport-axis>
            <ngt-soba-gizmo-viewport-axis
                [color]="instance.readKey('axisColors')[2]"
                [rotation]="[0, -90 | radian, 0]"
                [scale]="instance.readKey('axisScale')"
            ></ngt-soba-gizmo-viewport-axis>

            <ng-container *ngIf="!instance.readKey('hideAxisHeads')">
                <ngt-soba-gizmo-viewport-axis-head
                    [arcStyle]="instance.readKey('axisColors')[0]"
                    [position]="[1, 0, 0]"
                    [label]="instance.readKey('labels')[0]"
                    [labelColor]="instance.readKey('labelColor')"
                    [font]="instance.readKey('font')"
                    [disabled]="instance.readKey('disabled')"
                    [axisHeadScale]="instance.readKey('axisHeadScale')"
                ></ngt-soba-gizmo-viewport-axis-head>
                <ngt-soba-gizmo-viewport-axis-head
                    [arcStyle]="instance.readKey('axisColors')[1]"
                    [position]="[0, 1, 0]"
                    [label]="instance.readKey('labels')[1]"
                    [labelColor]="instance.readKey('labelColor')"
                    [font]="instance.readKey('font')"
                    [disabled]="instance.readKey('disabled')"
                    [axisHeadScale]="instance.readKey('axisHeadScale')"
                ></ngt-soba-gizmo-viewport-axis-head>
                <ngt-soba-gizmo-viewport-axis-head
                    [arcStyle]="instance.readKey('axisColors')[2]"
                    [position]="[0, 0, 1]"
                    [label]="instance.readKey('labels')[2]"
                    [labelColor]="instance.readKey('labelColor')"
                    [font]="instance.readKey('font')"
                    [disabled]="instance.readKey('disabled')"
                    [axisHeadScale]="instance.readKey('axisHeadScale')"
                ></ngt-soba-gizmo-viewport-axis-head>
                <ng-container *ngIf="!instance.readKey('hideNegativeAxes')">
                    <ngt-soba-gizmo-viewport-axis-head
                        [arcStyle]="instance.readKey('axisColors')[0]"
                        [position]="[-1, 0, 0]"
                        [labelColor]="instance.readKey('labelColor')"
                        [font]="instance.readKey('font')"
                        [disabled]="instance.readKey('disabled')"
                        [axisHeadScale]="instance.readKey('axisHeadScale')"
                    ></ngt-soba-gizmo-viewport-axis-head>
                    <ngt-soba-gizmo-viewport-axis-head
                        [arcStyle]="instance.readKey('axisColors')[1]"
                        [position]="[0, -1, 0]"
                        [labelColor]="instance.readKey('labelColor')"
                        [font]="instance.readKey('font')"
                        [disabled]="instance.readKey('disabled')"
                        [axisHeadScale]="instance.readKey('axisHeadScale')"
                    ></ngt-soba-gizmo-viewport-axis-head>
                    <ngt-soba-gizmo-viewport-axis-head
                        [arcStyle]="instance.readKey('axisColors')[2]"
                        [position]="[0, 0, -1]"
                        [labelColor]="instance.readKey('labelColor')"
                        [font]="instance.readKey('font')"
                        [disabled]="instance.readKey('disabled')"
                        [axisHeadScale]="instance.readKey('axisHeadScale')"
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
        NgtWrapper,
    ],
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(SobaGizmoViewport)],
})
export class SobaGizmoViewport extends NgtGroup {
    @Input() set axisColors(axisColors: NgtObservableInput<[string, string, string]>) {
        this.instance.write({ axisColors });
    }

    @Input() set axisScale(axisScale: NgtObservableInput<[number, number, number]>) {
        this.instance.write({ axisScale });
    }

    @Input() set labels(labels: NgtObservableInput<[string, string, string]>) {
        this.instance.write({ labels });
    }

    @Input() set axisHeadScale(axisHeadScale: NgtObservableInput<number>) {
        this.instance.write({ axisHeadScale });
    }

    @Input() set labelColor(labelColor: NgtObservableInput<string>) {
        this.instance.write({ labelColor });
    }

    @Input() set hideNegativeAxes(hideNegativeAxes: NgtObservableInput<boolean>) {
        this.instance.write({ hideNegativeAxes });
    }

    @Input() set hideAxisHeads(hideAxisHeads: NgtObservableInput<boolean>) {
        this.instance.write({ hideAxisHeads });
    }

    @Input() set disabled(disabled: NgtObservableInput<boolean>) {
        this.instance.write({ disabled });
    }

    @Input() set font(font: NgtObservableInput<string>) {
        this.instance.write({ font });
    }

    protected readonly instance = injectInstance({ host: true });

    constructor() {
        super();
        this.instance.write({
            font: '18px Inter var, Arial, sans-serif',
            axisColors: ['#ff3653', '#0adb50', '#2c8fdf'],
            axisScale: [0.8, 0.05, 0.05],
            axisHeadScale: 1,
            labels: ['X', 'Y', 'Z'],
            labelColor: '#000',
        });
    }
}
