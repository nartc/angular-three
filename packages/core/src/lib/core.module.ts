import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgtCanvasComponent } from './canvas.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgtCanvasComponent],
  exports: [NgtCanvasComponent],
})
export class NgtCoreModule {}
