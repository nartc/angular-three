import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SsaoPassDirective } from './ssao-pass.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [SsaoPassDirective],
  exports: [SsaoPassDirective],
})
export class PostprocessingSsaoPassModule {}
