/**
 * AngularThree (NGT) is partly ported from React Three Fiber (R3F).
 *
 * Current SHA from R3F:
 * 17ff08f6731c32fb182ccf4eb48cd44cbc1608d6
 * chore(docs): add Vercel prism example
 */
import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';
import { provideCameraRef, provideObjectRef, provideSceneRef } from './di/three';
import { NgtResize } from './directives/resize';
import { createPointerEvents } from './events';
import { NgtLoader } from './services/loader';
import { NgtResizeResult } from './services/resize';
import { NgtComponentStore } from './stores/component-store';
import { NgtStore } from './stores/store';
import type {
  NgtBooleanInput,
  NgtCamera,
  NgtCanvasInputs,
  NgtDomEvent,
  NgtDpr,
  NgtSize,
  NgtState,
  NgtStateGetter,
  NgtVector3,
} from './types';
import { updateCamera } from './utils/camera';
import { coerceBoolean } from './utils/coercion';
import { createLoop } from './utils/loop';
import { make } from './utils/make';

const rootStateMap = new Map<Element, NgtStateGetter>();
const { invalidate, advance } = createLoop(rootStateMap);

@Component({
  selector: 'ngt-canvas',
  standalone: true,
  template: `
    <div ngtResize #rendererContainer style="height: 100%; width: 100%">
      <canvas #rendererCanvas style="display: block">
        <ng-container *ngIf="projectContent" [ngTemplateOutlet]="contentTemplate"></ng-container>
      </canvas>
    </div>
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  imports: [NgIf, NgTemplateOutlet, NgtResize],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NgtStore,
    provideObjectRef(NgtCanvas, (canvas) => canvas.sceneRef),
    provideSceneRef(NgtCanvas, (canvas) => canvas.sceneRef),
    provideCameraRef(NgtCanvas, (canvas) => canvas.cameraRef),
  ],
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
})
export class NgtCanvas extends NgtComponentStore<NgtCanvasInputs> implements OnInit, OnDestroy {
  @HostBinding('class.ngt-canvas') readonly hostClass = true;

  @Input() set linear(linear: NgtBooleanInput) {
    this.set({ linear: coerceBoolean(linear) });
  }

  @Input() set legacy(legacy: NgtBooleanInput) {
    this.set({ legacy: coerceBoolean(legacy) });
  }

  @Input() set flat(flat: NgtBooleanInput) {
    this.set({ flat: coerceBoolean(flat) });
  }

  @Input() set orthographic(orthographic: NgtBooleanInput) {
    this.set({ orthographic: coerceBoolean(orthographic) });
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

  @Input() set shadows(shadows: NgtBooleanInput | Partial<THREE.WebGLShadowMap>) {
    this.set({
      shadows: typeof shadows === 'object' ? (shadows as Partial<THREE.WebGLShadowMap>) : coerceBoolean(shadows),
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

  @Input() set performance(performance: NgtCanvasInputs['performance']) {
    this.set({ performance });
  }

  @Input() set initialLog(value: NgtBooleanInput) {
    this._initialLog = coerceBoolean(value);
  }
  get initialLog(): boolean {
    return this._initialLog;
  }
  private _initialLog = false;

  @Input() set projectContent(value: NgtBooleanInput) {
    this._projectContent = coerceBoolean(value);
  }
  get projectContent(): boolean {
    return this._projectContent;
  }
  private _projectContent = false;

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild(NgtResize, { static: true })
  resize$!: Observable<NgtResizeResult>;

  @Output() created = new EventEmitter<NgtState>();
  @Output() canvasPointerMissed = new EventEmitter<MouseEvent>();

  private readonly store = inject(NgtStore);
  private readonly zone = inject(NgZone);
  private readonly loader = inject(NgtLoader);
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;

  get cameraRef() {
    return this.store.getState((s) => s.cameraRef);
  }

  get sceneRef() {
    return this.store.getState((s) => s.sceneRef);
  }

  private oldSize?: NgtSize;
  private oldDpr?: number;
  private oldCamera?: NgtCamera & { manual?: boolean | undefined };

  private readonly configureStoreOnResize = this.effect<NgtResizeResult>(
    tap((resizeResult) => {
      if (resizeResult.width > 0 && resizeResult.height > 0) {
        this.store.configure(
          { ...this.getState(), size: resizeResult },
          this.rendererCanvas.nativeElement,
          invalidate,
          advance
        );
      }
    })
  );

  private readonly onStateChanges = this.effect(
    tap(() => {
      const { camera, size, viewport, gl } = this.store.getState();
      // Resize camera and renderer on changes to size and pixelratio
      if (size !== this.oldSize || viewport.dpr !== this.oldDpr) {
        this.oldSize = size;
        this.oldDpr = viewport.dpr;
        // Update camera & renderer
        updateCamera(camera, size);
        gl.setPixelRatio(viewport.dpr);
        gl.setSize(size.width, size.height, size.updateStyle);
      }

      // Update viewport once the camera changes
      if (camera !== this.oldCamera) {
        this.oldCamera = camera;
        // Update viewport
        this.store.set((s) => ({ viewport: { ...s.viewport, ...s.viewport.getCurrentViewport(camera) } }));
      }
    })
  );

  override initialize() {
    super.initialize();
    // set default inputs if not set
    this.set({
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
      this.effect<NgtResizeResult>(($) => $)(this.resize$);
      this.set({ eventSource: this.host.nativeElement });

      if (this.canvasPointerMissed.observed) {
        // update pointerMissed event
        this.store.patchState({
          onPointerMissed: (event) => {
            // go back into angular zone
            this.zone.run(() => {
              this.canvasPointerMissed.emit(event);
            });
          },
        });
      }

      // set rootStateMap
      rootStateMap.set(this.rendererCanvas.nativeElement, this.store.getState);

      // setup canvas state
      this.store.init(invalidate, advance);
      this.store.configure(this.getState(), this.rendererCanvas.nativeElement, invalidate, advance);

      // configure the store on resize
      this.configureStoreOnResize(this.resize$);

      this.store.onReady(() => {
        const state = this.store.getState();

        this.oldSize = state.size;
        this.oldDpr = state.viewport.dpr;
        this.oldCamera = state.camera;

        const inputs = this.getState();

        this.onStateChanges(
          this.store.select(
            this.store.select((s) => s.size),
            this.store.select((s) => s.viewport),
            this.store.select((s) => s.camera),
            this.defaultProjector,
            { debounce: true }
          )
        );

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
              innerState.pointer.set((x / innerState.size.width) * 2 - 1, -(y / innerState.size.height) * 2 + 1);
              innerState.raycaster.setFromCamera(innerState.pointer, innerState.camera);
            },
          });
        }

        this.created.emit(this.store.getState());

        if (this.initialLog) {
          setTimeout(() => {
            console.group('[NgtCanvas] Initialized');
            console.log(this.store.getState());
            console.groupEnd();
          }, 500);
        }

        // start the rendering loop (animation frame)
        this.store.startLoop();
      });
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.store.destroy(rootStateMap, this.rendererCanvas.nativeElement);
    this.loader.destroy();
  }
}
