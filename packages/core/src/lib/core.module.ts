import { NgModule } from '@angular/core';
import { CanvasComponent } from './canvas.component';
import { Object3dControllerDirective } from './controllers';
import { RepeatDirective } from './directives';
import { MathConstantPipe, MathPipe } from './pipes';

@NgModule({
  declarations: [
    CanvasComponent,
    Object3dControllerDirective,
    MathPipe,
    MathConstantPipe,
    RepeatDirective,
  ],
  exports: [
    CanvasComponent,
    Object3dControllerDirective,
    MathPipe,
    MathConstantPipe,
    RepeatDirective,
  ],
})
export class ThreeCoreModule {}
