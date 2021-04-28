import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CanvasComponent } from './canvas.component';
import { Object3dControllerDirective } from './controllers/object-3d-controller.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [CanvasComponent, Object3dControllerDirective],
  exports: [CanvasComponent, Object3dControllerDirective],
})
export class ThreeCoreModule {}
