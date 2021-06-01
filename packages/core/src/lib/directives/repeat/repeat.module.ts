import { NgModule } from '@angular/core';
import { RepeatDirective } from './repeat.directive';

@NgModule({
  declarations: [RepeatDirective],
  exports: [RepeatDirective],
})
export class ThreeRepeatModule {}
