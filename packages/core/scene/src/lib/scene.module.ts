import { NgModule } from '@angular/core';
import { SceneDirective } from './scene.directive';

@NgModule({
  declarations: [SceneDirective],
  exports: [SceneDirective],
})
export class ThreeSceneModule {}
