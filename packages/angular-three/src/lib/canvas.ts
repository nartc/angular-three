import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    HostBinding,
    inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { createPointerEvents } from './events';
import { provideInstanceRef } from './instance';
import { NgtResize, NgtResizeResult } from './services/resize';
import { NgtComponentStore } from './stores/component-store';
import { NgtStore, rootStateMap } from './stores/store';
import type { NgtCanvasInputs, NgtDomEvent, NgtDpr, NgtObservableInput, NgtVector3 } from './types';
import { NgtLoader } from './services/loader';

@Component({
    selector: 'ngt-canvas-container',
    standalone: true,
    template: '<ng-content></ng-content>',
    providers: [NgtResize],
    styles: [
        `
            :host {
                display: block;
                height: 100%;
                width: 100%;
            }
        `,
    ],
})
export class NgtCanvasContainer {
    @Output() resize = inject(NgtResize) as Observable<NgtResizeResult>;
}

@Component({
    selector: 'ngt-canvas',
    standalone: true,
    template: `
        <ngt-canvas-container (resize)="onResize($event)">
            <canvas #glCanvas style="display: block">
                <ng-container *ngIf="isConfigured" [ngTemplateOutlet]="canvasContent"></ng-container>
                <ng-content></ng-content>
            </canvas>
        </ngt-canvas-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            :host {
                display: block;
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        `,
    ],
    imports: [NgtCanvasContainer, NgIf, NgTemplateOutlet, AsyncPipe],
    providers: [NgtStore, provideInstanceRef(NgtCanvas, (canvas) => canvas.sceneRef)],
})
export class NgtCanvas extends NgtComponentStore<NgtCanvasInputs> implements OnInit, OnDestroy {
    @HostBinding('class.ngt-canvas') readonly hostClass = true;

    @HostBinding('style.pointerEvents') get pointerEvents() {
        return this.read((s) => s.eventSource) !== this.host.nativeElement ? 'none' : 'auto';
    }

    @Input() set linear(linear: NgtObservableInput<boolean>) {
        this.write({ linear });
    }

    @Input() set legacy(legacy: NgtObservableInput<boolean>) {
        this.write({ legacy });
    }

    @Input() set flat(flat: NgtObservableInput<boolean>) {
        this.write({ flat });
    }

    @Input() set orthographic(orthographic: NgtObservableInput<boolean>) {
        this.write({ orthographic });
    }

    @Input() set frameloop(frameloop: NgtObservableInput<'always' | 'demand' | 'never'>) {
        this.write({ frameloop });
    }

    @Input() set dpr(dpr: NgtObservableInput<NgtDpr>) {
        this.write({ dpr });
    }

    @Input() set raycaster(raycaster: Partial<THREE.Raycaster>) {
        this.write({ raycaster });
    }

    @Input() set shadows(shadows: boolean | Partial<THREE.WebGLShadowMap>) {
        this.write({
            shadows: typeof shadows === 'object' ? (shadows as Partial<THREE.WebGLShadowMap>) : shadows,
        });
    }

    @Input() set camera(camera: NgtCanvasInputs['camera']) {
        this.write({ camera });
    }

    @Input() set gl(gl: NgtCanvasInputs['gl']) {
        this.write({ gl });
    }

    @Input() set eventSource(eventSource: NgtCanvasInputs['eventSource']) {
        this.write({ eventSource });
    }

    @Input() set eventPrefix(eventPrefix: NgtCanvasInputs['eventPrefix']) {
        this.write({ eventPrefix });
    }

    @Input() set lookAt(lookAt: NgtObservableInput<NgtVector3>) {
        this.write({ lookAt });
    }

    @Input() set performance(performance: NgtCanvasInputs['performance']) {
        this.write({ performance });
    }

    @Output() created = new EventEmitter();
    @Output() canvasPointerMissed = new EventEmitter();

    @ViewChild('glCanvas', { static: true })
    glCanvas!: ElementRef<HTMLCanvasElement>;

    @ContentChild(TemplateRef, { static: true })
    canvasContent!: TemplateRef<unknown>;

    private readonly zone = inject(NgZone);
    private readonly loader = inject(NgtLoader);
    private readonly store = inject(NgtStore, { self: true });

    private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;

    get sceneRef() {
        return this.store.read((s) => s.sceneRef);
    }

    get isConfigured() {
        return this.store.isConfigured;
    }

    override initialize() {
        super.initialize();
        this.write({
            shadows: false,
            linear: false,
            flat: false,
            legacy: false,
            orthographic: false,
            frameloop: 'always',
            dpr: [1, 2],
            events: createPointerEvents,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            if (!this.eventSource) {
                this.eventSource = this.host.nativeElement;
            }

            if (this.canvasPointerMissed.observed) {
                // update pointerMissed event
                this.store.write({
                    onPointerMissed: (event: MouseEvent) => {
                        // go back into angular zone
                        this.zone.run(() => {
                            this.canvasPointerMissed.emit(event);
                        });
                    },
                });
            }

            // set rootStateMap
            rootStateMap.set(this.glCanvas.nativeElement, this.store.read);

            // setup canvas state
            this.store.init();

            this.store.onReady(() => {
                const state = this.store.read();
                const inputs = this.read();

                // canvas is ready
                this.store.write((s) => ({ internal: { ...s.internal, active: true } }));

                // Connect to eventsource
                state.events.connect?.(
                    inputs.eventSource instanceof ElementRef ? inputs.eventSource.nativeElement : inputs.eventSource
                );

                // Set up compute function
                if (inputs.eventPrefix) {
                    state.setEvents({
                        compute: (event, stateGetter) => {
                            const innerState = stateGetter();
                            const x = event[(inputs.eventPrefix + 'X') as keyof NgtDomEvent] as number;
                            const y = event[(inputs.eventPrefix + 'Y') as keyof NgtDomEvent] as number;
                            innerState.pointer.set(
                                (x / innerState.size.width) * 2 - 1,
                                -(y / innerState.size.height) * 2 + 1
                            );
                            innerState.raycaster.setFromCamera(innerState.pointer, innerState.camera);
                        },
                    });
                }

                if (this.created.observed) {
                    this.zone.run(() => {
                        this.created.emit(this.store.read());
                    });
                }
            });
        });
    }

    onResize(resizeResult: NgtResizeResult) {
        this.zone.runOutsideAngular(() => {
            const { width, height } = resizeResult;
            if (width > 0 && height > 0) {
                if (!this.store.isInit) {
                    this.store.init();
                }
                this.store.configure(this.read(), this.glCanvas.nativeElement);
            }
        });
    }

    override ngOnDestroy() {
        this.loader.destroy();
        super.ngOnDestroy();
    }
}
