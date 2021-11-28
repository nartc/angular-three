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
import { asapScheduler, observeOn, tap } from 'rxjs';
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
import { NgtCanvasInputsStore } from './stores/canvas-inputs.store';
import { EnhancedComponentStore } from './stores/enhanced-component-store';
import { NgtEventsStore } from './stores/events.store';
import { NgtInstancesStore } from './stores/instances.store';
import { NgtPerformanceStore } from './stores/performance.store';
import { NgtStore } from './stores/store';

@Component({
  selector: 'ngt-canvas',
  exportAs: 'ngtCanvas',
  template: ` <canvas #rendererCanvas></canvas>`,
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
    NgtCanvasInputsStore,
    NgtPerformanceStore,
    NgtEventsStore,
    NgtAnimationFrameStore,
    NgtInstancesStore,
    NgtLoopService,
  ],
})
export class NgtCanvas extends EnhancedComponentStore implements OnInit {
  @HostBinding('class.ngt-canvas') hostClass = true;

  @Input() set vr(vr: boolean | '') {
    this.canvasInputsStore.updaters.setVr(vr === '' ? true : vr);
  }

  @Input() set linear(linear: boolean | '') {
    this.canvasInputsStore.updaters.setLinear(linear === '' ? true : linear);
  }

  @Input() set flat(flat: boolean | '') {
    this.canvasInputsStore.updaters.setFlat(flat === '' ? true : flat);
  }

  @Input() set frameloop(frameloop: 'always' | 'demand' | 'never') {
    this.canvasInputsStore.updaters.setFrameloop(frameloop);
  }

  @Input() set orthographic(orthographic: boolean | '') {
    this.canvasInputsStore.updaters.setOrthographic(
      orthographic === '' ? true : orthographic
    );
  }

  @Input() set performance(performance: NgtPerformance) {
    this.canvasInputsStore.updaters.setPerformance(performance);
  }

  @Input() set size(size: NgtSize) {
    this.canvasInputsStore.updaters.setSize(size);
  }

  @Input() set dpr(dpr: NgtDpr) {
    this.canvasInputsStore.updaters.setDpr(dpr);
  }

  @Input() set clock(clock: THREE.Clock) {
    this.canvasInputsStore.updaters.setClock(clock);
  }

  @Input() set raycaster(raycaster: Partial<NgtRaycaster>) {
    this.canvasInputsStore.updaters.setRaycaster(raycaster);
  }

  @Input() set shadows(shadows: boolean | Partial<THREE.WebGLShadowMap>) {
    this.canvasInputsStore.updaters.setShadows(shadows);
  }

  @Input() set camera(cameraOptions: NgtCameraOptions) {
    this.canvasInputsStore.updaters.setCameraOptions(cameraOptions);
  }

  @Input() set scene(sceneOptions: NgtSceneOptions) {
    this.canvasInputsStore.updaters.setSceneOptions(sceneOptions);
  }

  @Input() set gl(glOptions: NgtGLOptions) {
    this.canvasInputsStore.updaters.setGlOptions(glOptions);
  }

  @Output() created = new EventEmitter<NgtCreatedState>();

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    @Self() private store: NgtStore,
    @Self() private canvasInputsStore: NgtCanvasInputsStore,
    @Self() private performanceStore: NgtPerformanceStore,
    @Self() private eventsStore: NgtEventsStore,
    @Self() private animationFrameStore: NgtAnimationFrameStore,
    @Self() private loopService: NgtLoopService,
    private ngZone: NgZone
  ) {
    super({});
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.store.init(this.rendererCanvas.nativeElement);
      this.performanceStore.init();
      this.eventsStore.init();
      this.animationFrameStore.init();

      this.ready(this.store.selectors.ready$);
    });
  }

  readonly ready = this.effect<boolean>((ready$) =>
    ready$.pipe(
      tap((ready) => {
        this.ngZone.runOutsideAngular(() => {
          if (ready) {
            const state = this.store.getImperativeState();
            if (state.renderer) {
              this.eventsStore.connect(state.renderer.domElement);
              this.loopService.invalidate(state);
              this.created.emit(state as NgtCreatedState);
            }
          }
        });
      }),
      observeOn(asapScheduler)
    )
  );
}

/**
 * gl?: GLProps
 *   events?: (store: UseStore<RootState>) => EventManager<TCanvas>
 *   size?: Size
 *   mode?: typeof modes[number]
 *   onCreated?: (state: RootState) => void
 */

/**
 * gl: THREE.WebGLRenderer
 *   size: Size
 *   vr?: boolean
 *   shadows?: boolean | Partial<THREE.WebGLShadowMap>
 *   linear?: boolean
 *   flat?: boolean
 *   orthographic?: boolean
 *   frameloop?: 'always' | 'demand' | 'never'
 *   performance?: Partial<Omit<Performance, 'regress'>>
 *   dpr?: Dpr
 *   clock?: THREE.Clock
 *   raycaster?: Partial<Raycaster>
 *   camera?:
 *     | Camera
 *     | Partial<
 *         ReactThreeFiber.Object3DNode<THREE.Camera, typeof THREE.Camera> &
 *           ReactThreeFiber.Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera> &
 *           ReactThreeFiber.Object3DNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera>
 *       >
 *   onPointerMissed?: (event: ThreeEvent<PointerEvent>) => void
 */

/**
 * type GLProps =
 *   | Renderer
 *   | ((canvas: HTMLCanvasElement) => Renderer)
 *   | Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters>
 *   | undefined
 */
