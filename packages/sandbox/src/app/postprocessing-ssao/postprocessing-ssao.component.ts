import { NgtCanvas } from '@angular-three/core';
import { NgtsStats } from '@angular-three/soba/performance';
import { Component, inject } from '@angular/core';
import { BlendFunctionService } from './blend-function.service';
import { Scene } from './scene.component';

@Component({
    selector: 'sandbox-postprocessing-ssao',
    standalone: true,
    template: `
        <button (click)="service.toggle()">Toggle BlendFunction (Current: {{ service.blendFunctionName }})</button>
        <div style="height: 400px; width: 400px">
            <ngt-canvas [scene]="Scene" [camera]="{ position: [10, 10, 10] }" />
            <ngts-stats />
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
    providers: [BlendFunctionService],
    imports: [NgtCanvas, NgtsStats],
})
export default class SandboxPostprocessingSSAO {
    readonly Scene = Scene;
    readonly service = inject(BlendFunctionService);
}
