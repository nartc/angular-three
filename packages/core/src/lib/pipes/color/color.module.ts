import { NgModule } from '@angular/core';
import { ColorPipe } from './color.pipe';

@NgModule({
  declarations: [ColorPipe],
  exports: [ColorPipe],
})
export class ThreeColorPipeModule {}
