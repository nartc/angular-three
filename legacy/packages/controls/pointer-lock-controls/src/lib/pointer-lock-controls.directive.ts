// GENERATED
import { NgtControls } from '@angular-three/controls';
import type { NgtCamera } from '@angular-three/core';
import { DestroyedService, CanvasStore, AnimationStore } from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import { Directive, NgZone, Inject, SkipSelf } from '@angular/core';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

@Directive({
  selector: 'ngt-pointer-lock-controls',
  exportAs: 'ngtPointerLockControls',
  providers: [DestroyedService],
})
export class NgtPointerLockControls extends NgtControls<PointerLockControls> {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    ngZone: NgZone,
    @SkipSelf() protected canvasStore: CanvasStore,
    @SkipSelf() animationStore: AnimationStore,
    protected destroyed: DestroyedService
  ) {
    super(ngZone, canvasStore, animationStore, destroyed);
  }

  initControls(camera: NgtCamera): PointerLockControls {
    return new PointerLockControls(camera, this.document.body);
  }
}
