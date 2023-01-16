import { NgtRxStore } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Color, ColorRepresentation, Vector2 } from 'three';

@Directive()
export abstract class NgtsLineInputs extends NgtRxStore {
    @Input() set vertexColors(vertexColors: Array<Color | [number, number, number]>) {
        this.set({
            vertexColors: vertexColors === undefined ? this.get('vertexColors') : vertexColors,
        });
    }

    @Input() set lineWidth(lineWidth: number) {
        this.set({ lineWidth: lineWidth === undefined ? this.get('lineWidth') : lineWidth });
    }

    @Input() set alphaToCoverage(alphaToCoverage: boolean) {
        this.set({
            alphaToCoverage: alphaToCoverage === undefined ? this.get('alphaToCoverage') : alphaToCoverage,
        });
    }

    @Input() set color(color: ColorRepresentation) {
        this.set({ color: color === undefined ? this.get('color') : color });
    }

    @Input() set segments(segments: boolean) {
        this.set({ segments: segments === undefined ? this.get('segments') : segments });
    }

    @Input() set dashed(dashed: boolean) {
        this.set({ dashed: dashed === undefined ? this.get('dashed') : dashed });
    }

    @Input() set dashScale(dashScale: number) {
        this.set({ dashScale: dashScale === undefined ? this.get('dashScale') : dashScale });
    }

    @Input() set dashSize(dashSize: number) {
        this.set({ dashSize: dashSize === undefined ? this.get('dashSize') : dashSize });
    }

    @Input() set dashOffset(dashOffset: number) {
        this.set({ dashOffset: dashOffset === undefined ? this.get('dashOffset') : dashOffset });
    }

    @Input() set gapSize(gapSize: number) {
        this.set({ gapSize: gapSize === undefined ? this.get('gapSize') : gapSize });
    }

    @Input() set resolution(resolution: Vector2) {
        this.set({ resolution: resolution === undefined ? this.get('resolution') : resolution });
    }

    @Input() set wireframe(wireframe: boolean) {
        this.set({ wireframe: wireframe === undefined ? this.get('wireframe') : wireframe });
    }

    @Input() set worldUnits(worldUnits: boolean) {
        this.set({ worldUnits: worldUnits === undefined ? this.get('worldUnits') : worldUnits });
    }

    override initialize(): void {
        super.initialize();
        this.set({ color: 'black', segments: false });
    }
}
