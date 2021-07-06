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
  OnInit,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { asapScheduler, fromEvent } from 'rxjs';
import { observeOn, takeUntil } from 'rxjs/operators';
import type { Scene, WebGLRenderer, WebGLShadowMap } from 'three';
import { DestroyedService, LoopService } from './services';
import {
  AnimationStore,
  CanvasStore,
  EventsStore,
  InstancesStore,
} from './stores';
import type {
  CameraOptions,
  RaycasterOptions,
  SceneOptions,
  ThreeCameraAlias,
} from './typings';

@Component({
  selector: 'ngt-canvas',
  exportAs: 'ngtCanvas',
  template: `
    <canvas #rendererCanvas></canvas>
    <ng-content></ng-content>
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
    CanvasStore,
    EventsStore,
    InstancesStore,
    AnimationStore,
    LoopService,
    DestroyedService,
  ],
})
export class CanvasComponent implements OnInit {
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
    camera: ThreeCameraAlias;
    scene: Scene;
  }>();

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    @Self() private readonly canvasStore: CanvasStore,
    @Self() private readonly animationStore: AnimationStore,
    @Self() private readonly eventsStore: EventsStore,
    @Self() private readonly loopService: LoopService,
    private readonly ngZone: NgZone,
    private readonly hostElement: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly destroyed: DestroyedService
  ) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.canvasStore.setSize({
        width: this.hostElement.nativeElement.clientWidth,
        height: this.hostElement.nativeElement.clientHeight,
      });

      this.canvasStore.setDpr(
        (this.document as Document).defaultView?.devicePixelRatio || 1
      );

      this.canvasStore.initRendererEffect(this.rendererCanvas.nativeElement);
      this.canvasStore.initSceneEffect(this.scene);
      this.canvasStore.initCameraEffect(this.camera);
      this.canvasStore.initRaycasterEffect(this.raycaster);

      this.initWindowResizeListener();
      this.initActiveListener();
    });
  }

  private initWindowResizeListener() {
    if (this.document?.defaultView) {
      fromEvent(this.document.defaultView, 'resize')
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          this.ngZone.runOutsideAngular(() => {
            this.canvasStore.windowResizeEffect({
              size: {
                width: this.hostElement.nativeElement.clientWidth,
                height: this.hostElement.nativeElement.clientHeight,
              },
              dpr:
                (this.document as Document).defaultView?.devicePixelRatio || 1,
            });
          });
        });
    }
  }

  private initActiveListener() {
    this.canvasStore.active$
      .pipe(takeUntil(this.destroyed), observeOn(asapScheduler))
      .subscribe((active) => {
        this.ngZone.runOutsideAngular(() => {
          if (active) {
            const { renderer, camera, scene } =
              this.canvasStore.getImperativeState();
            if (renderer && camera && scene) {
              this.created.emit({ gl: renderer, camera, scene });
              this.eventsStore.connectEffect(renderer.domElement);
              this.loopService.start();
            }
          }
        });
      });
  }
}
