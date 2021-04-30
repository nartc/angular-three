import { NgModule } from '@angular/core';
import { StatsDirective } from './stats.directive';

@NgModule({
  declarations: [StatsDirective],
  exports: [StatsDirective],
})
export class ThreeStatsModule {}
