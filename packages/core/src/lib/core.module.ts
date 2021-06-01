import { NgModule } from '@angular/core';
import { CanvasComponent } from './canvas.component';
import { Object3dControllerDirective } from './controllers';
import { RepeatDirective } from './directives';

@NgModule({
  declarations: [CanvasComponent, Object3dControllerDirective, RepeatDirective],
  exports: [CanvasComponent, Object3dControllerDirective, RepeatDirective],
})
export class ThreeCoreModule {}
