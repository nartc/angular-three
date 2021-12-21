import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgtCanvas } from './canvas.component';

@NgModule({
  declarations: [NgtCanvas],
  imports: [CommonModule],
  exports: [NgtCanvas],
})
export class NgtCoreModule {}
