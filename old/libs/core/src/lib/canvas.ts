import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  NgModule,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { provideCameraRef, provideObjectRef, provideSceneRef } from './di/object';
import { NgtLoader } from './services/loader';
import { NgtResize } from './services/resize';
import { NgtComponentStore } from './stores/component-store';
import { NgtStore } from './stores/store';
import type {
  BooleanInput,
  NgtCameraOptions,
  NgtDpr,
  NgtGLOptions,
  NgtSceneOptions,
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
    <canvas #rendererCanvas></canvas>
    <ng-container *ngIf="projectContent" [ngTemplateOutlet]="contentTemplate"></ng-container>
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  imports: [NgIf, NgTemplateOutlet],
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

      :host canvas {
        display: block;
      }
    `,
  ],
  providers: [
    NgtStore,
    NgtResize,
    provideObjectRef(NgtCanvas, (canvas) => canvas.sceneRef),
    provideSceneRef(NgtCanvas, (canvas) => canvas.sceneRef),
    provideCameraRef(NgtCanvas, (canvas) => canvas.cameraRef),
  ],
})
export class NgtCanvas extends NgtComponentStore implements OnInit {
  @HostBinding('class.ngt-canvas') hostClass = true;

  @Input() set linear(linear: BooleanInput) {
    this.store.set({ linear: coerceBooleanProperty(linear) });
  }

  @Input() set legacy(legacy: BooleanInput) {
    this.store.set({ legacy: coerceBooleanProperty(legacy) });
  }

  @Input() set flat(flat: BooleanInput) {
    this.store.set({ flat: coerceBooleanProperty(flat) });
  }

  @Input() set frameloop(frameloop: 'always' | 'demand' | 'never') {
    this.store.setFrameloop(frameloop);
  }

  @Input() set orthographic(orthographic: BooleanInput) {
    this.store.set({
      orthographic: coerceBooleanProperty(orthographic),
    });
  }

  @Input() set dpr(dpr: NgtDpr) {
    this.store.setDpr(dpr);
  }

  @Input() set raycaster(raycaster: Partial<THREE.Raycaster>) {
    this.store.set({ raycasterOptions: raycaster });
  }

  @Input() set shadows(shadows: BooleanInput | Partial<THREE.WebGLShadowMap>) {
    this.store.set({
      shadows:
        typeof shadows === 'object' ? (shadows as Partial<THREE.WebGLShadowMap>) : coerceBooleanProperty(shadows),
    });
  }

  @Input() set camera(cameraOptions: NgtCameraOptions) {
    this.store.set({ cameraOptions });
  }
  get cameraRef() {
    return this.store.get((s) => s.cameraRef);
  }

  @Input() set lookAt(lookAt: NgtVector3) {
    this.store.set({ lookAt: make(THREE.Vector3, lookAt) });
  }

  @Input() set scene(sceneOptions: NgtSceneOptions) {
    this.store.set({ sceneOptions });
  }
  get sceneRef() {
    return this.store.get((s) => s.sceneRef);
  }

  @Input() set gl(glOptions: NgtGLOptions) {
    this.store.set({ glOptions });
  }

  private _initialLog = false;
  get initialLog(): boolean {
    return this._initialLog;
  }
  @Input() set initialLog(value: BooleanInput) {
    this._initialLog = coerceBooleanProperty(value);
  }

  private _projectContent = false;
  get projectContent(): boolean {
    return this._projectContent;
  }
  @Input() set projectContent(value: BooleanInput) {
    this._projectContent = coerceBooleanProperty(value);
  }

  @Output() created = new EventEmitter<NgtState>();
  @Output() pointermissed = new EventEmitter<MouseEvent>();

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;

  private zone = inject(NgZone);
  private store = inject(NgtStore);
  private loader = inject(NgtLoader);

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      // if there is handler to pointermissed on the canvas
      // update pointermissed in events store so that
      // events util will handle it
      if (this.pointermissed.observed) {
        this.store.set({
          pointerMissed: (event) => {
            this.pointermissed.emit(event);
          },
        });
      }
      rootStateMap.set(this.rendererCanvas.nativeElement, () => this.store.get());

      this.store.init(this.rendererCanvas.nativeElement, rootStateMap, invalidate, advance);
      this.store.onReady(() => {
        const canvasState = this.store.get();
        this.created.emit(canvasState);
        if (this.initialLog) {
          console.group('[NgtCanvas] Initialized');
          console.log(canvasState);
          console.groupEnd();
        }
        this.store.startLoop(this.store.select());
      });
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.loader.destroy();
  }
}

@NgModule({
  imports: [NgtCanvas],
  exports: [NgtCanvas],
})
export class NgtCanvasModule {}
