import { NgModule } from '@angular/core';
import { NgtColorPipe } from './color.pipe';

@NgModule({
  declarations: [NgtColorPipe],
  exports: [NgtColorPipe],
})
export class NgtColorPipeModule {}
