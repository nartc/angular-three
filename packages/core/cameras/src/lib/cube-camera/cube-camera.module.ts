import { NgModule } from '@angular/core';
import { CubeCameraDirective } from './cube-camera.directive';

@NgModule({
  declarations: [CubeCameraDirective],
  exports: [CubeCameraDirective],
})
export class ThreeCubeCameraModule {}
