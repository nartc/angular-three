import {
  AnimationStore,
  CanvasStore,
  DestroyedService,
  distinctKeyMap,
  NgtAnimationParticipant,
  NgtCamera,
  UnknownRecord,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  SkipSelf,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import * as THREE from 'three';

@Directive()
export abstract class NgtControls<TControls = unknown>
  extends NgtAnimationParticipant<TControls>
  implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter<TControls>();

  constructor(
    ngZone: NgZone,
    @SkipSelf() protected canvasStore: CanvasStore,
    @SkipSelf() animationStore: AnimationStore,
    protected destroyed: DestroyedService
  ) {
    super(animationStore, ngZone);
  }

  private _controls?: TControls;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.canvasStore.selectors.internal$
        .pipe(distinctKeyMap('active'), takeUntil(this.destroyed))
        .subscribe((active) => {
          this.ngZone.runOutsideAngular(() => {
            const { camera, renderer, scene } =
              this.canvasStore.getImperativeState();
            if (active && camera && renderer && scene) {
              this._controls = this.initControls(camera, renderer, scene);
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
    camera: NgtCamera,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene
  ): TControls;

  ngOnDestroy() {
    super.ngOnDestroy();
    this.ngZone.runOutsideAngular(() => {
      if (this.controls && (this.controls as UnknownRecord).dispose) {
        ((this.controls as UnknownRecord).dispose as () => void)();
      }
    });
  }
}
