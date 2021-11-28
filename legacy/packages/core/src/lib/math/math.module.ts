import { NgModule } from '@angular/core';
import { NgtMathConstantPipe } from './math-constant.pipe';
import { NgtMathPipe } from './math.pipe';

@NgModule({
  declarations: [NgtMathPipe, NgtMathConstantPipe],
  exports: [NgtMathPipe, NgtMathConstantPipe],
})
export class NgtMathPipeModule {}
