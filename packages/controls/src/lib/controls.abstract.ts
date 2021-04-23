import type { ThreeCamera } from '@angular-three/core';
import {
  AnimationLoopParticipant,
  AnimationStore,
  CanvasStore,
  DestroyedService,
  runOutsideAngular,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  SkipSelf,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import type { WebGLRenderer } from 'three';

@Directive()
export abstract class ThreeControls<TControls = unknown>
  extends AnimationLoopParticipant<TControls>
  implements OnInit {
  @Output() ready = new EventEmitter<TControls>();
  @Output() zonelessReady = new EventEmitter<TControls>();

  constructor(
    readonly ngZone: NgZone,
    @SkipSelf() protected readonly canvasStore: CanvasStore,
    @SkipSelf() readonly animationStore: AnimationStore,
    protected readonly destroyed: DestroyedService
  ) {
    super(animationStore, ngZone);
  }

  private _controls?: TControls;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.canvasStore.active$
        .pipe(
          runOutsideAngular(this.ngZone, (active, run) => {
            const { camera, renderer } = this.canvasStore.getImperativeState();
            if (active && camera && renderer) {
              this._controls = this.initControls(camera, renderer);
              if (this.controls) {
                run(() => {
                  this.ready.emit(this.controls);
                });
                this.zonelessReady.emit(this.controls);
                this.participate(this.controls);
              }
            }
          }),
          takeUntil(this.destroyed)
        )
        .subscribe();
    });
  }

  get controls(): TControls | undefined {
    return this._controls;
  }

  abstract initControls(
    camera: ThreeCamera,
    renderer: WebGLRenderer
  ): TControls;
}
