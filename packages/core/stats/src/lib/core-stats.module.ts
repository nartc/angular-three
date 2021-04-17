import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatsDirective } from './stats.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [StatsDirective],
  exports: [StatsDirective],
})
export class ThreeCoreStatsModule {}
