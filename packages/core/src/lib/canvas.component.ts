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
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { asapScheduler, fromEvent, observeOn, takeUntil } from 'rxjs';
import * as THREE from 'three';
import type {
  NgtCamera,
  NgtCameraOptions,
  NgtRaycasterOptions,
  NgtSceneOptions,
} from './models';
import { DestroyedService } from './services/destroyed.service';
import { LoopService } from './services/loop.service';
import { AnimationStore } from './stores/animation.store';
import { CanvasStore } from './stores/canvas.store';
import { EventsStore } from './stores/events.store';
import { InstancesStore } from './stores/instances.store';

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
export class NgtCanvasComponent implements OnInit {
  @HostBinding('class.ngt-canvas') hostClass = true;

  @Input() set orthographic(v: boolean) {
    this.canvasStore.updaters.setIsOrthographic(v);
  }

  @Input() set linear(v: boolean) {
    this.canvasStore.updaters.setIsLinear(v);
  }

  @Input() set shadows(v: boolean | Partial<THREE.WebGLShadowMap>) {
    this.canvasStore.updaters.setShadows(v);
  }

  @Input() set alpha(v: boolean) {
    this.canvasStore.updaters.setAlpha(v);
  }

  @Input() camera?: NgtCameraOptions;
  @Input() scene?: NgtSceneOptions;
  @Input() raycaster?: NgtRaycasterOptions = {};

  @Output() created = new EventEmitter<{
    gl: THREE.WebGLRenderer;
    camera: NgtCamera;
    scene: THREE.Scene;
  }>();

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    @Self() private canvasStore: CanvasStore,
    @Self() private animationStore: AnimationStore,
    @Self() private eventsStore: EventsStore,
    @Self() private loopService: LoopService,
    private ngZone: NgZone,
    private hostElement: ElementRef<HTMLElement>,
    @Optional() @Inject(DOCUMENT) private document: Document,
    private destroyed: DestroyedService
  ) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.canvasStore.setSize({
        width: this.hostElement.nativeElement.clientWidth,
        height: this.hostElement.nativeElement.clientHeight,
      });

      this.canvasStore.setDpr(this.document.defaultView?.devicePixelRatio || 1);

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
              dpr: this.document.defaultView?.devicePixelRatio || 1,
            });
          });
        });
    }
  }

  private initActiveListener() {
    this.canvasStore.selectors.internal$
      .pipe(takeUntil(this.destroyed), observeOn(asapScheduler))
      .subscribe(({ active }) => {
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
