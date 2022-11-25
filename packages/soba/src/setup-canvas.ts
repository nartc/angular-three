import { createBeforeRenderCallback, NgtCanvas, NgtPerformance } from '@angular-three/core';
import { NgtColorAttribute } from '@angular-three/core/attributes';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtStats } from '@angular-three/core/stats';
import { SobaOrbitControls } from '@angular-three/soba/controls';

interface CanvasOptions {
    camera?: {
        position?: [number, number, number];
        fov?: number;
    };
    performance?: Partial<Omit<NgtPerformance, 'regress'>>;
    whiteBackground?: boolean;
    controls?:
        | boolean
        | {
              makeDefault?: boolean;
          };
    lights?: boolean;
}

const defaultCanvasOptions: CanvasOptions = {
    camera: {
        position: [-5, 5, 5],
        fov: 75,
    },
    performance: {
        current: 1,
        min: 0.5,
        max: 1,
        debounce: 200,
    },
    whiteBackground: false,
    controls: true,
    lights: true,
};

export function setupCanvas(canvasOptions?: CanvasOptions) {
    const mergedOptions = (
        canvasOptions
            ? {
                  ...defaultCanvasOptions,
                  ...canvasOptions,
                  camera: {
                      ...defaultCanvasOptions.camera,
                      ...(canvasOptions.camera || {}),
                  },
                  performance: {
                      ...defaultCanvasOptions.performance,
                      ...(canvasOptions.performance || {}),
                  },
              }
            : defaultCanvasOptions
    ) as Required<CanvasOptions>;

    return (story: string) => `
<ngt-canvas
    [shadows]="true"
    [performance]="{
        current: ${mergedOptions.performance.current},
        min: ${mergedOptions.performance.min},
        max: ${mergedOptions.performance.max},
        debounce: ${mergedOptions.performance.debounce}
    }"
    [camera]="{
        position: [${mergedOptions.camera.position}],
        fov: ${mergedOptions.camera.fov}
    }"
>
    <ng-template>
        <ngt-color *ngIf="${mergedOptions.whiteBackground}" color="white" attach="background"></ngt-color>

        <ng-container *ngIf="${mergedOptions.lights}">
            <ngt-ambient-light [intensity]="0.8"></ngt-ambient-light>
            <ngt-point-light [intensity]="1" [position]="[0, 6, 0]"></ngt-point-light>
        </ng-container>

        <ng-container *ngIf="${mergedOptions.controls}">
            <ngt-soba-orbit-controls
                [makeDefault]="${typeof mergedOptions.controls === 'object' && mergedOptions.controls.makeDefault}"
            ></ngt-soba-orbit-controls>
        </ng-container>

        ${story}
    </ng-template>
</ngt-canvas>
<ngt-stats></ngt-stats>
    `;
}

export const setupCanvasImports = [
    NgtCanvas,
    NgtAmbientLight,
    NgtPointLight,
    NgtColorAttribute,
    SobaOrbitControls,
    NgtStats,
];

export const turnAnimation = createBeforeRenderCallback(({ object }) => {
    object.rotation.y += 0.01;
});
