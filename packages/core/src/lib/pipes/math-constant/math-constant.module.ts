import { NgModule } from '@angular/core';
import { MathConstantPipe } from './math-constant.pipe';

@NgModule({
  declarations: [MathConstantPipe],
  exports: [MathConstantPipe],
})
export class ThreeMathConstantPipeModule {}
