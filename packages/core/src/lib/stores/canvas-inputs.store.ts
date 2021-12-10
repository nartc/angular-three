import { Injectable } from '@angular/core';
import { NgtCanvasInputsState } from '../models';
import { EnhancedRxState } from './enhanced-rx-state';

@Injectable()
export class NgtCanvasInputsStore extends EnhancedRxState<NgtCanvasInputsState> {
  constructor() {
    super();
    this.set({
      dpr: 1,
      shadows: false,
      cameraOptions: {},
      glOptions: {},
      raycaster: {},
      sceneOptions: {},
    });
  }
}

// @Injectable()
// export class NgtCanvasInputsStore extends EnhancedComponentStore<NgtCanvasInputsState> {
//   constructor(
//     @Inject(NGT_PERFORMANCE_OPTIONS) performance: NgtPerformance,
//     hostElement: ElementRef<HTMLElement>
//   ) {
//     super({
//       vr: false,
//       shadows: false,
//       flat: false,
//       linear: false,
//       orthographic: false,
//       dpr: 1,
//       clock: new THREE.Clock(),
//       frameloop: 'always',
//       performance,
//       size: {
//         height: hostElement.nativeElement.clientHeight,
//         width: hostElement.nativeElement.clientWidth,
//       },
//       cameraOptions: {},
//       glOptions: {},
//       raycaster: {},
//       sceneOptions: {},
//     });
//   }
// }
