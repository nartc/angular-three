import { NgModule } from '@angular/core';
import { NgtPrimitive } from './primitive.directive';

@NgModule({
  declarations: [NgtPrimitive],
  exports: [NgtPrimitive],
})
export class NgtPrimitiveModule {}
