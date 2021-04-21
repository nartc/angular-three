import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LodDirective } from './lod.directive';
import { LodLevelDirective } from './lod-level.directive';

@NgModule({
  declarations: [LodDirective, LodLevelDirective],
  imports: [CommonModule],
  exports: [LodDirective, LodLevelDirective],
})
export class ThreeLodModule {}
