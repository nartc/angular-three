import { NgModule } from '@angular/core';
import { MathPipe } from './math.pipe';

@NgModule({
  declarations: [MathPipe],
  exports: [MathPipe],
})
export class ThreeMathPipeModule {}
