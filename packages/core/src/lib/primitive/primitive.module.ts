import { NgModule } from '@angular/core';
import { PrimitiveDirective } from './primitive.directive';

@NgModule({
  declarations: [PrimitiveDirective],
  exports: [PrimitiveDirective],
})
export class ThreePrimitiveModule {}
