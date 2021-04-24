import type {
  CameraOptions,
  RaycasterOptions,
  SceneOptions,
  ThreeCamera,
} from '@angular-three/core';
import {
  AnimationStore,
  CanvasStore,
  DestroyedService,
  EventsStore,
  InstancesStore,
  LoopService,
} from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  Self,
  ViewChild,
} from '@angular/core';
import { asyncScheduler } from 'rxjs';
import { observeOn, takeUntil } from 'rxjs/operators';
import type { Scene, WebGLRenderer, WebGLShadowMap } from 'three';

@Component({
  selector: 'ngt-canvas',
  exportAs: 'ngtCanvas',
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
    CanvasStore,
    EventsStore,
    InstancesStore,
    AnimationStore,
    LoopService,
    DestroyedService,
  ],
})
export class CanvasComponent implements OnInit, OnDestroy {
  @HostBinding('class.ngt-canvas') hostClass = true;

  @Input() set orthographic(v: boolean) {
    this.canvasStore.setIsOrthographic(v);
  }

  @Input() set linear(v: boolean) {
    this.canvasStore.setIsLinear(v);
  }

  @Input() set shadows(v: boolean | Partial<WebGLShadowMap>) {
    this.canvasStore.setShadows(v);
  }

  @Input() camera?: CameraOptions;
  @Input() scene?: SceneOptions;
  @Input() raycaster?: RaycasterOptions = {};

  @Output() created = new EventEmitter<{
    gl: WebGLRenderer;
    camera: ThreeCamera;
    scene: Scene;
  }>();

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;

  private windowResizeListener?: () => void;

  constructor(
    @Self() private readonly canvasStore: CanvasStore,
    @Self() private readonly animationStore: AnimationStore,
    @Self() private readonly eventsStore: EventsStore,
    @Self() private readonly loopService: LoopService,
    private readonly ngZone: NgZone,
    private readonly hostElement: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: any,
    private readonly destroyed: DestroyedService
  ) {
    canvasStore.setSize({
      width: hostElement.nativeElement.clientWidth,
      height: hostElement.nativeElement.clientHeight,
    });
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.canvasStore.initRendererEffect(this.rendererCanvas.nativeElement);
      this.canvasStore.initSceneEffect(this.scene);
      this.canvasStore.initCameraEffect(this.camera);
      this.canvasStore.initRaycasterEffect(this.raycaster);

      this.initWindowResizeListener();
      this.initActiveListener();
    });
  }

  ngOnDestroy(): void {
    if (this.windowResizeListener) {
      this.windowResizeListener();
    }
  }

  private initWindowResizeListener() {
    this.windowResizeListener = this.renderer.listen(
      (this.document as Document).defaultView,
      'resize',
      () => {
        this.canvasStore.windowResizeEffect({
          size: {
            width: this.hostElement.nativeElement.clientWidth,
            height: this.hostElement.nativeElement.clientHeight,
          },
          dpr: (this.document as Document).defaultView?.devicePixelRatio || 0,
        });
      }
    );
  }

  private initActiveListener() {
    this.canvasStore.active$
      .pipe(takeUntil(this.destroyed), observeOn(asyncScheduler))
      .subscribe((active) => {
        if (active) {
          const {
            renderer,
            camera,
            scene,
          } = this.canvasStore.getImperativeState();
          if (renderer && camera && scene) {
            this.created.emit({ gl: renderer, camera, scene });
            this.eventsStore.connectEffect(renderer.domElement);
            this.loopService.start();
          }
        }
      });
  }
}
