import type { ThreeCamera } from '@angular-three/core';
import {
  AnimationLoopParticipant,
  AnimationStore,
  CanvasStore,
  DestroyedService,
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
        .pipe(takeUntil(this.destroyed))
        .subscribe((active) => {
          this.ngZone.runOutsideAngular(() => {
            const { camera, renderer } = this.canvasStore.getImperativeState();
            if (active && camera && renderer) {
              this._controls = this.initControls(camera, renderer);
              if (this.controls) {
                this.ready.emit(this.controls);
                this.participate(this.controls);
              }
            }
          });
        });
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
