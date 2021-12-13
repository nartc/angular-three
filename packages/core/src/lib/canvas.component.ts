import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnInit,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import {
  NgtCameraOptions,
  NgtCreatedState,
  NgtDpr,
  NgtGLOptions,
  NgtPerformance,
  NgtRaycaster,
  NgtSceneOptions,
  NgtSize,
} from './models';
import { NgtResize } from './resize/resize.service';
import { NgtLoopService } from './services/loop.service';
import { NgtAnimationFrameStore } from './stores/animation-frame.store';
import { EnhancedRxState } from './stores/enhanced-rx-state';
import { NgtEventsStore } from './stores/events.store';
import { NgtPerformanceStore } from './stores/performance.store';
import { NgtStore } from './stores/store';

@Component({
  selector: 'ngt-canvas',
  template: ` <canvas #rendererCanvas></canvas> `,
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
    NgtResize,
    NgtStore,
    NgtPerformanceStore,
    NgtEventsStore,
    NgtAnimationFrameStore,
    NgtLoopService,
  ],
})
export class NgtCanvas extends EnhancedRxState implements OnInit {
  @HostBinding('class.ngt-canvas') hostClass = true;

  @Input() set vr(vr: boolean | '') {
    this.store.set({ vr: vr === '' ? true : vr });
  }

  @Input() set linear(linear: boolean | '') {
    this.store.set({ linear: linear === '' ? true : linear });
  }

  @Input() set flat(flat: boolean | '') {
    this.store.set({ flat: flat === '' ? true : flat });
  }

  @Input() set frameloop(frameloop: 'always' | 'demand' | 'never') {
    this.store.set({ frameloop });
  }

  @Input() set orthographic(orthographic: boolean | '') {
    this.store.set({ orthographic: orthographic === '' ? true : orthographic });
  }

  @Input() set performance(performance: NgtPerformance) {
    this.store.set({ performance });
  }

  @Input() set size(size: NgtSize) {
    this.store.set({ size });
  }

  @Input() set dpr(dpr: NgtDpr) {
    this.store.set({ dpr });
  }

  @Input() set clock(clock: THREE.Clock) {
    this.store.set({ clock });
  }

  @Input() set raycaster(raycaster: Partial<NgtRaycaster>) {
    this.store.set({ raycasterOptions: raycaster });
  }

  @Input() set shadows(shadows: boolean | Partial<THREE.WebGLShadowMap>) {
    this.store.set({ shadows });
  }

  @Input() set camera(cameraOptions: NgtCameraOptions) {
    this.store.set({ cameraOptions });
  }

  @Input() set scene(sceneOptions: NgtSceneOptions) {
    this.store.set({ sceneOptions });
  }

  @Input() set gl(glOptions: NgtGLOptions) {
    this.store.set({ glOptions });
  }

  @Output() created = new EventEmitter<NgtCreatedState>();
  @Output() pointermissed = new EventEmitter<MouseEvent>();

  @ViewChild('rendererCanvas')
  set rendererCanvas(v: ElementRef<HTMLCanvasElement>) {
    this.store.actions.canvasElement(v.nativeElement);
  }

  constructor(
    @Self() private store: NgtStore,
    @Self() private performanceStore: NgtPerformanceStore,
    @Self() private eventsStore: NgtEventsStore,
    @Self() private animationFrameStore: NgtAnimationFrameStore,
    @Self() private loopService: NgtLoopService,
    private ngZone: NgZone
  ) {
    super();
  }

  ngOnInit() {
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

    this.hold(this.store.select('ready'), (ready) => {
      if (ready) {
        this.ngZone.runOutsideAngular(() => {
          const state = this.store.get();
          this.eventsStore.actions.element(state.renderer.domElement);
          this.loopService.invalidate(state);
          this.created.emit(state as NgtCreatedState);
        });
      }
    });
  }
}
