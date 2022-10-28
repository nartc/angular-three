import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { createPointerEvents } from './events';
import { NgtResize } from './services/resize';
import { NgtComponentStore } from './stores/component-store';
import { NgtStore } from './stores/store';
import type {
  BooleanInput,
  NgtCanvasInputs,
  NgtDomEvent,
  NgtDpr,
  NgtState,
  NgtVector3,
} from './types';
import { coerceBooleanProperty } from './utils/coercion';
import { createLoop } from './utils/loop';
import { make } from './utils/make';

const rootStateMap = new Map<Element, () => NgtState>();
const { invalidate, advance } = createLoop(rootStateMap);

@Component({
  selector: 'ngt-canvas',
  standalone: true,
  template: `
    <div #rendererContainer>
      <canvas #rendererCanvas></canvas>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ngt-canvas]': 'true',
  },
  providers: [NgtStore, NgtResize],
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      :host > div {
        height: 100%;
        width: 100%;
      }

      :host canvas {
        display: block;
      }
    `,
  ],
})
export class NgtCanvas
  extends NgtComponentStore<NgtCanvasInputs>
  implements OnInit, OnDestroy
{
  @Input() set linear(linear: BooleanInput) {
    this.set({ linear: coerceBooleanProperty(linear) });
  }

  @Input() set legacy(legacy: BooleanInput) {
    this.set({ legacy: coerceBooleanProperty(legacy) });
  }

  @Input() set flat(flat: BooleanInput) {
    this.set({ flat: coerceBooleanProperty(flat) });
  }

  @Input() set orthographic(orthographic: BooleanInput) {
    this.set({ orthographic: coerceBooleanProperty(orthographic) });
  }

  @Input() set frameloop(frameloop: 'always' | 'demand' | 'never') {
    this.set({ frameloop });
  }

  @Input() set dpr(dpr: NgtDpr) {
    this.set({ dpr });
  }

  @Input() set raycaster(raycaster: Partial<THREE.Raycaster>) {
    this.set({ raycaster });
  }

  @Input() set shadows(shadows: BooleanInput | Partial<THREE.WebGLShadowMap>) {
    this.set({
      shadows:
        typeof shadows === 'object'
          ? (shadows as Partial<THREE.WebGLShadowMap>)
          : coerceBooleanProperty(shadows),
    });
  }

  @Input() set camera(camera: NgtCanvasInputs['camera']) {
    this.set({ camera });
  }

  @Input() set gl(gl: NgtCanvasInputs['gl']) {
    this.set({ gl });
  }

  @Input() set eventSource(eventSource: NgtCanvasInputs['eventSource']) {
    this.set({ eventSource });
  }

  @Input() set eventPrefix(eventPrefix: NgtCanvasInputs['eventPrefix']) {
    this.set({ eventPrefix });
  }

  @Input() set lookAt(lookAt: NgtVector3) {
    this.set({ lookAt: make(THREE.Vector3, lookAt) });
  }

  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;

  @Output() created = new EventEmitter<NgtState>();
  @Output() canvasPointerMissed = new EventEmitter<MouseEvent>();

  readonly #store = inject(NgtStore);
  readonly #zone = inject(NgZone);

  ngOnInit() {
    this.#zone.runOutsideAngular(() => {
      // set default inputs if not set
      this.set((s) => ({
        shadows: s.shadows || false,
        linear: s.linear || false,
        flat: s.flat || false,
        legacy: s.legacy || false,
        orthographic: s.orthographic || false,
        frameloop: s.frameloop || 'always',
        dpr: s.dpr || [1, 2],
        eventSource: s.eventSource || this.rendererContainer.nativeElement,
        events: createPointerEvents,
      }));

      if (this.canvasPointerMissed.observed) {
        // update pointerMissed event
        this.#store.set({
          onPointerMissed: (event) => {
            // go back into angular zone
            this.#zone.run(() => {
              this.canvasPointerMissed.emit(event);
            });
          },
        });
      }

      // set rootStateMap
      rootStateMap.set(
        this.rendererCanvas.nativeElement,
        this.#store.get.bind(this.#store)
      );

      // setup canvas state
      this.#store.init(
        this.rendererContainer.nativeElement,
        invalidate,
        advance
      );
      this.#store.configure(
        this.get(),
        this.rendererCanvas.nativeElement,
        invalidate,
        advance
      );
      this.#store.onReady(() => {
        const state = this.#store.get();
        const inputs = this.get();

        // Connect to event source
        state.events.connect?.(
          inputs.eventSource instanceof ElementRef
            ? inputs.eventSource.nativeElement
            : inputs.eventSource
        );

        // Set up compute function
        if (inputs.eventPrefix) {
          state.setEvents({
            compute: (event, stateGetter) => {
              const innerState = stateGetter();
              const x = event[
                (inputs.eventPrefix + 'X') as keyof NgtDomEvent
              ] as number;
              const y = event[
                (inputs.eventPrefix + 'Y') as keyof NgtDomEvent
              ] as number;
              innerState.pointer.set(
                (x / innerState.size.width) * 2 - 1,
                -(y / innerState.size.height) * 2 + 1
              );
              innerState.raycaster.setFromCamera(
                innerState.pointer,
                innerState.camera
              );
            },
          });
        }

        this.created.emit(this.#store.get());
        this.#store.startLoop();
      });
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.#store.destroy(rootStateMap, this.rendererCanvas.nativeElement);
  }
}
