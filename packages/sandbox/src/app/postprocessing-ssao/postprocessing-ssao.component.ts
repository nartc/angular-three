import { NgtCanvas } from '@angular-three/core';
import { NgtsStats } from '@angular-three/soba/performance';
import { Component } from '@angular/core';
import { BlendFunction } from 'postprocessing';

@Component({
    selector: 'sandbox-postprocessing-ssao',
    standalone: true,
    template: `
        <button (click)="toggle()">Toggle BlendFunction (current: {{ blendFunctionName }})</button>
        <div style="height: 400px; width: 400px">
            <ngt-canvas [scene]="Scene" [camera]="{ position: [10, 10, 10] }" />
            <ngt-stats />
        </div>
    `,
    styles: [
        `
            :host {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                height: 100%;
                width: 100%;
                justify-content: center;
                align-items: center;
            }

            button {
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                background: #cecece;
            }
        `,
    ],
    imports: [NgtCanvas, NgtsStats],
})
export default class SandboxPostprocessingSSAO {
    readonly Scene = Scene;

    blendFunction = BlendFunction.NORMAL;

    get blendFunctionName() {
        return this.blendFunction === BlendFunction.NORMAL ? 'NORMAL' : 'MULTIPLY';
    }

    toggle() {
        this.blendFunction =
            this.blendFunction === BlendFunction.NORMAL ? BlendFunction.MULTIPLY : BlendFunction.NORMAL;
    }
}
