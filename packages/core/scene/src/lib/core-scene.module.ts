import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SceneDirective } from './scene.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    SceneDirective
  ],
  exports: [
    SceneDirective
  ],
})
export class ThreeSceneModule {}
