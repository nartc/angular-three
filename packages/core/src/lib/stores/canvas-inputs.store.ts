import { ElementRef, Inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import { NgtCanvasInputsState, NgtPerformance } from '../models';
import { NGT_PERFORMANCE_OPTIONS } from '../performance/tokens';
import { EnhancedComponentStore } from './enhanced-component-store';

@Injectable()
export class NgtCanvasInputsStore extends EnhancedComponentStore<NgtCanvasInputsState> {
  constructor(
    @Inject(NGT_PERFORMANCE_OPTIONS) performance: NgtPerformance,
    hostElement: ElementRef<HTMLElement>
  ) {
    super({
      vr: false,
      shadows: false,
      flat: false,
      linear: false,
      orthographic: false,
      dpr: 1,
      clock: new THREE.Clock(),
      frameloop: 'always',
      performance,
      size: {
        height: hostElement.nativeElement.clientHeight,
        width: hostElement.nativeElement.clientWidth,
      },
      cameraOptions: {},
      glOptions: {},
      raycaster: {},
      sceneOptions: {},
    });
  }
}
