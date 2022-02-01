import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  NgModule,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NGT_CANVAS_OPTIONS } from './di/canvas';
import { NgtLoop } from './services/loop';
import { NgtPerformance } from './services/performance';
import { NgtResize } from './services/resize';
import { NgtAnimationFrameStore } from './stores/animation-frame';
import { NgtCanvasStore } from './stores/canvas';
import { NgtEventsStore } from './stores/events';
import { NgtStore } from './stores/store';
import type {
  NgtCameraOptions,
  NgtCanvasOptions,
  NgtCreatedState,
  NgtDpr,
  NgtGLOptions,
  NgtPerformanceOptions,
  NgtRaycaster,
  NgtSceneOptions,
  NgtSize,
} from './types';
import { zonelessRequestAnimationFrame } from './utils/zoneless-timer';

@Component({
  selector: 'ngt-canvas',
  template: `
    <canvas #rendererCanvas></canvas>
    <ng-container *ngIf="canvasOptions.projectContent">
      <ng-content></ng-content>
    </ng-container>
  `,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NgtCanvasStore,
    NgtAnimationFrameStore,
    NgtEventsStore,
    NgtResize,
    NgtLoop,
    NgtPerformance,
  ],
})
export class NgtCanvas extends NgtStore implements OnInit {
  @HostBinding('class.ngt-canvas') hostClass = true;

  @Input() set vr(vr: boolean | '') {
    this.canvasStore.set({ vr: vr === '' ? true : vr });
  }

  @Input() set linear(linear: boolean | '') {
    this.canvasStore.set({ linear: linear === '' ? true : linear });
  }

  @Input() set flat(flat: boolean | '') {
    this.canvasStore.set({ flat: flat === '' ? true : flat });
  }

  @Input() set frameloop(frameloop: 'always' | 'demand' | 'never') {
    this.canvasStore.set({ frameloop });
  }

  @Input() set orthographic(orthographic: boolean | '') {
    this.canvasStore.set({
      orthographic: orthographic === '' ? true : orthographic,
    });
  }

  @Input() set performance(performance: NgtPerformanceOptions) {
    this.canvasStore.set({ performance });
  }

  @Input() set size(size: NgtSize) {
    this.canvasStore.set({ size });
  }

  @Input() set dpr(dpr: NgtDpr) {
    this.canvasStore.set({ dpr });
  }

  @Input() set clock(clock: THREE.Clock) {
    this.canvasStore.set({ clock });
  }

  @Input() set raycaster(raycaster: Partial<NgtRaycaster>) {
    this.canvasStore.set({ raycasterOptions: raycaster });
  }

  @Input() set shadows(shadows: boolean | Partial<THREE.WebGLShadowMap>) {
    this.canvasStore.set({ shadows });
  }

  @Input() set camera(cameraOptions: NgtCameraOptions) {
    this.canvasStore.set({ cameraOptions });
  }

  @Input() set scene(sceneOptions: NgtSceneOptions) {
    this.canvasStore.set({ sceneOptions });
  }

  @Input() set gl(glOptions: NgtGLOptions) {
    this.canvasStore.set({ glOptions });
  }

  @Output() created = new EventEmitter<NgtCreatedState>();
  @Output() pointermissed = new EventEmitter<MouseEvent>();

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private canvasStore: NgtCanvasStore,
    private eventsStore: NgtEventsStore,
    private animationFrameStore: NgtAnimationFrameStore,
    private loop: NgtLoop,
    @Inject(NGT_CANVAS_OPTIONS) public canvasOptions: NgtCanvasOptions
  ) {
    super();
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      // if there is handler to pointermissed on the canvas
      // update pointermissed in events store so that
      // events util will handle it
      if (this.pointermissed.observed) {
        this.eventsStore.set({
          pointerMissed: (event) => {
            this.pointermissed.emit(event);
          },
        });
      }

      this.canvasStore.init(this.rendererCanvas.nativeElement);

      this.hold(this.canvasStore.select('ready'), (ready) => {
        if (ready) {
          const canvasState = this.canvasStore.get();
          this.eventsStore.init(canvasState.renderer.domElement);
          this.animationFrameStore.init();
          this.loop.invalidate(canvasState);
          this.created.emit(canvasState as NgtCreatedState);
        }
      });
    });
  }
}

@NgModule({
  declarations: [NgtCanvas],
  exports: [NgtCanvas],
  imports: [CommonModule],
})
export class NgtCoreModule {}
