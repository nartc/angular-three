import { NgModule } from '@angular/core';
import { FogPipe } from './fog.pipe';

@NgModule({
  declarations: [FogPipe],
  exports: [FogPipe],
})
export class ThreeFogPipeModule {}
