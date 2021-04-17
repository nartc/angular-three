import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsDirective } from './stats.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    StatsDirective
  ],
  exports: [
    StatsDirective
  ],
})
export class CoreStatsModule {}
