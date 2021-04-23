// GENERATED

import { ThreeControls } from '@angular-three/controls';
import type { ThreeCamera } from '@angular-three/core';
import {
  DestroyedService,
  CanvasStore,
  AnimationStore,
} from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import { Directive, NgZone, Inject, SkipSelf } from '@angular/core';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

@Directive({
  selector: 'ngt-pointerLockControls',
  exportAs: 'ngtPointerLockControls',
  providers: [DestroyedService],
})
export class PointerLockControlsDirective extends ThreeControls<PointerLockControls> {
  constructor(
    @Inject(DOCUMENT) private readonly document: any,
    readonly ngZone: NgZone,
    @SkipSelf() protected readonly canvasStore: CanvasStore,
    @SkipSelf() readonly animationStore: AnimationStore,
    protected readonly destroyed: DestroyedService
  ) {
    super(ngZone, canvasStore, animationStore, destroyed);
  }

  initControls(camera: ThreeCamera): PointerLockControls {
    return new PointerLockControls(camera, this.document.body);
  }
}
