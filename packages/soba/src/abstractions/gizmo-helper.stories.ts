import { NgtArgs } from '@angular-three/core';
import { NgtObjectPrimitive } from '@angular-three/core/primitives';
import { SobaGizmoHelper, SobaGizmoViewcube, SobaGizmoViewport } from '@angular-three/soba/abstractions';
import { SobaOrbitControls } from '@angular-three/soba/controls';
import { SobaGLTFLoader } from '@angular-three/soba/loaders';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

@Component({
    selector: 'storybook-default-gizmo',
    standalone: true,
    template: `
        <ng-container *ngIf="node$ | async as node">
            <ngt-soba-gizmo-helper [alignment]="alignment" [margin]="margin">
                <ngt-soba-gizmo-viewcube
                    *ngIf="mode === 'viewcube'; else viewport"
                    [faces]="['Right', 'Left', 'Top', 'Bottom', 'Front', 'Back']"
                    [opacity]="1"
                    color="white"
                    strokeColor="gray"
                    textColor="black"
                    hoverColor="lightgray"
                ></ngt-soba-gizmo-viewcube>
                <ng-template #viewport>
                    <ngt-soba-gizmo-viewport
                        [axisColors]="['red', 'green', 'blue']"
                        labelColor="black"
                        hideNegativeAxes="false"
                    ></ngt-soba-gizmo-viewport>
                </ng-template>
            </ngt-soba-gizmo-helper>

            <ngt-object-primitive *args="[node.scene]" [scale]="0.01"></ngt-object-primitive>

            <ngt-soba-orbit-controls [makeDefault]="true"></ngt-soba-orbit-controls>
        </ng-container>
    `,

    imports: [
        SobaGizmoHelper,
        SobaGizmoViewcube,
        SobaGizmoViewport,
        NgIf,
        SobaOrbitControls,
        NgtObjectPrimitive,
        AsyncPipe,
        NgtArgs,
    ],
})
class DefaultGizmo {
    readonly node$ = inject(SobaGLTFLoader).load('soba/assets/LittlestTokyo.glb');

    @Input() mode: 'viewport' | 'viewcube' = 'viewcube';
    @Input() alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left' = 'bottom-right';
    @Input() margin: [number, number] = [80, 80];
}
export default {
    title: 'Abstractions/Gizmo Helper',
    decorators: [
        componentWrapperDecorator(setupCanvas({ camera: { position: [0, 0, 10] }, controls: false })),
        moduleMetadata({ imports: [setupCanvasImports, DefaultGizmo] }),
    ],
    argTypes: {
        alignment: {
            options: ['top-left', 'top-right', 'bottom-right', 'bottom-left'],
            control: { type: 'select' },
        },
        mode: {
            options: ['viewcube', 'viewport'],
            control: { type: 'select' },
        },
    },
} as Meta;

export const Default: Story = (args) => ({
    props: args,
    template: `
<storybook-default-gizmo [mode]="mode" [alignment]="alignment" [margin]="margin"></storybook-default-gizmo>
    `,
});

Default.args = {
    mode: 'viewcube',
    alignment: 'bottom-right',
    margin: [80, 80],
};
