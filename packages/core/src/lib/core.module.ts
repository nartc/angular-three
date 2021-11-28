import { NgModule } from '@angular/core';
import { NgtCanvas } from './canvas.component';
import { NgtAnimationSubscriberControllerModule } from './controllers/animation-subscriber.controller';
import { NgtAudioControllerModule } from './controllers/audio.controller';
import { NgtMaterialGeometryControllerModule } from './controllers/material-geometry.controller';
import { NgtObject3dInputsControllerModule } from './controllers/object-3d-inputs.controller';
import { NgtObject3dControllerModule } from './controllers/object-3d.controller';

@NgModule({
  declarations: [NgtCanvas],
  exports: [
    NgtCanvas,
    NgtMaterialGeometryControllerModule,
    NgtObject3dControllerModule,
    NgtObject3dInputsControllerModule,
    NgtAudioControllerModule,
    NgtAnimationSubscriberControllerModule,
  ],
})
export class NgtCoreModule {}
