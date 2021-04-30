import { NgModule } from '@angular/core';
import { SsaoPassDirective } from './ssao-pass.directive';

@NgModule({
  declarations: [SsaoPassDirective],
  exports: [SsaoPassDirective],
})
export class ThreeSsaoPassModule {}
