import { NgModule } from '@angular/core';
import { LodDirective } from './lod.directive';

@NgModule({
  declarations: [LodDirective],
  exports: [LodDirective],
})
export class ThreeLodModule {}
