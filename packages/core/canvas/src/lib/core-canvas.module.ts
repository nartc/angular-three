import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CanvasComponent } from './canvas.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CanvasComponent],
  exports: [CanvasComponent],
})
export class ThreeCanvasModule {}
