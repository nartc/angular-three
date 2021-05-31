import { NgModule } from '@angular/core';
import { GroupDirective } from './group.directive';

@NgModule({
  declarations: [GroupDirective],
  exports: [GroupDirective],
})
export class ThreeGroupModule {}
