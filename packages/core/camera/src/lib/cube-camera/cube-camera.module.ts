import { NgModule } from '@angular/core';
import { NgtCubeCamera } from './cube-camera.directive';

@NgModule({
  declarations: [NgtCubeCamera],
  exports: [NgtCubeCamera],
})
export class CubeCameraModule {}
