import { NgModule } from '@angular/core';
import { NgtCanvasComponent } from './canvas.component';
import { NgtObject3dControllerDirective } from './three/object-3d.controller';

@NgModule({
  declarations: [NgtCanvasComponent, NgtObject3dControllerDirective],
  exports: [NgtCanvasComponent, NgtObject3dControllerDirective],
})
export class NgtCoreModule {}
