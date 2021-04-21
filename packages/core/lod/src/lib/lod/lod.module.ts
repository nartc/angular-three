import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LodDirective } from './lod.directive';

@NgModule({
  declarations: [LodDirective],
  imports: [CommonModule],
  exports: [LodDirective],
})
export class ThreeLodModule {}
