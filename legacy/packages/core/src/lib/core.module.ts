import { NgModule } from '@angular/core';
import { NgtCanvasComponent } from './canvas.component';
import { NgtAudioController } from './three/audio.controller';
import { NgtObject3dController } from './three/object-3d.controller';

@NgModule({
  declarations: [NgtCanvasComponent, NgtObject3dController, NgtAudioController],
  exports: [NgtCanvasComponent, NgtObject3dController, NgtAudioController],
})
export class NgtCoreModule {}
