import { NgModule } from '@angular/core';
import { NgtCanvasComponent } from './canvas.component';
import { NgtObject3dController } from './three/object-3d.controller';

@NgModule({
  declarations: [NgtCanvasComponent, NgtObject3dController],
  exports: [NgtCanvasComponent, NgtObject3dController],
})
export class NgtCoreModule {}
