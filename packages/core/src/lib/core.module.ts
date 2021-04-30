import { NgModule } from '@angular/core';
import { CanvasComponent } from './canvas.component';
import { Object3dControllerDirective } from './controllers';

@NgModule({
  declarations: [CanvasComponent, Object3dControllerDirective],
  exports: [CanvasComponent, Object3dControllerDirective],
})
export class ThreeCoreModule {}
