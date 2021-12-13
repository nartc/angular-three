import { NgModule } from '@angular/core';
import { NgtCanvas } from './canvas.component';
import { NgtAnimationSubscriberControllerModule } from './controllers/animation-subscriber.controller';
import { NgtAudioControllerModule } from './controllers/audio.controller';
import { NgtContentGeometryControllerModule } from './controllers/content-geometry.controller';
import { NgtContentMaterialControllerModule } from './controllers/content-material.controller';
import { NgtMaterialGeometryControllerModule } from './controllers/material-geometry.controller';
import { NgtObject3dInputsControllerModule } from './controllers/object-3d-inputs.controller';
import { NgtObject3dControllerModule } from './controllers/object-3d.controller';
import { NgtColorPipeModule } from './pipes/color.pipe';
import { NgtMathPipeModule } from './pipes/math.pipe';
import { NgtVectorPipeModule } from './pipes/vector.pipe';

@NgModule({
  declarations: [NgtCanvas],
  exports: [
    NgtCanvas,
    NgtMaterialGeometryControllerModule,
    NgtContentMaterialControllerModule,
    NgtContentGeometryControllerModule,
    NgtObject3dControllerModule,
    NgtObject3dInputsControllerModule,
    NgtAudioControllerModule,
    NgtAnimationSubscriberControllerModule,
    NgtMathPipeModule,
    NgtVectorPipeModule,
    NgtColorPipeModule,
  ],
})
export class NgtCoreModule {}
